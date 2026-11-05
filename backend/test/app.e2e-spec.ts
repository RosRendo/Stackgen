import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createHmac } from 'crypto';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { LemonsqueezyService } from './../src/lemonsqueezy/lemonsqueezy.service';
import { AiModelGateway } from './../src/ai/model-gateway';
import * as express from 'express';

/**
 * Security regression suite.
 * Boots the real AppModule with PrismaService stubbed (no DB needed).
 * better-auth is jest-mocked to an unauthenticated session (see package.json
 * moduleNameMapper), so every authed endpoint must respond 401 — the exact
 * regression the old code had (5 open /ai/* endpoints).
 */

const prismaStub = {
  $connect: async () => {},
  user: {
    findUnique: async () => null,
    update: async () => ({}),
  },
  project: { count: async () => 0 },
  customer: {
    findUnique: async () => null,
    upsert: async () => ({}),
  },
  subscription: { upsert: async () => ({}), updateMany: async () => ({}) },
};

describe('StackGen security & routing (e2e)', () => {
  let app: INestApplication<App>;
  const gateway = AiModelGateway.getInstance();

  beforeAll(async () => {
    process.env.LEMONSQUEEZY_WEBHOOK_SECRET = 'test-webhook-secret';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaStub)
      .compile();

    app = moduleFixture.createNestApplication();
    // Populate req.rawBody exactly like production bootstrap does (rawBody: true)
    app.use(express.json({
      verify: (req: express.Request & { rawBody?: Buffer }, _res, buf) => {
        (req as any).rawBody = buf;
      },
    }));
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('public routes', () => {
    it('GET / returns hello', () =>
      request(app.getHttpServer()).get('/').expect(200));

    it('GET /ai/models returns model list (public by design)', () =>
      request(app.getHttpServer())
        .get('/ai/models')
        .expect(200)
        .then(res => {
          expect(Array.isArray(res.body)).toBe(true);
          const first = res.body[0];
          expect(first).toHaveProperty('id');
          expect(first).toHaveProperty('available');
        }));
  });

  describe('AI endpoints must require auth (was the S1 hole)', () => {
    const cases: [string, object][] = [
      ['/ai/generate-blueprint', { projectName: 'x', description: 'y', level: 'MVP' }],
      ['/ai/generate-task-prompt', { taskTitle: 'x', techStack: [] }],
      ['/ai/chat', { message: 'hi' }],
      ['/ai/generate-docs', { projectName: 'x', description: 'y', techStack: [], nodes: [] }],
      ['/ai/generate-guide', { projectName: 'x', description: 'y', techStack: [], checklist: [] }],
      ['/ai/scan-github', { githubUrl: 'https://github.com/facebook/react' }],
      ['/ai/estimate-cost', { level: 'MVP', techStack: [] }],
      ['/ai/generate-zip', { projectName: 'x', techStack: [] }],
    ];

    it.each(cases)('POST %s without session → 401', (url, body) =>
      request(app.getHttpServer())
        .post(url)
        .send(body)
        .expect(401));

    it.each(cases)('POST %s with non-whitelisted field → 400', (url, body) =>
      request(app.getHttpServer())
        .post(url)
        .send({ ...body, evilField: 'drop-table' })
        .expect(400));
  });

  describe('projects endpoints must require auth', () => {
    it('GET /projects → 401', () =>
      request(app.getHttpServer()).get('/projects').expect(401));

    it('GET /projects/admin/all without admin session → 401', () =>
      request(app.getHttpServer()).get('/projects/admin/all').expect(401));

    it('POST /projects → 401', () =>
      request(app.getHttpServer()).post('/projects').send({}).expect(401));
  });

  describe('lemonsqueezy webhook', () => {
    const payload = JSON.stringify({
      meta: { event_name: 'order_created', custom_data: { user_id: 'u1' } },
      data: { id: '1', attributes: { customer_id: 5, user_email: 'a@b.c' } },
    });

    it('missing signature → 401', () =>
      request(app.getHttpServer())
        .post('/lemonsqueezy/webhook')
        .send(payload)
        .expect(401));

    it('invalid signature → 401', () =>
      request(app.getHttpServer())
        .post('/lemonsqueezy/webhook')
        .set('X-Signature', 'deadbeef')
        .set('Content-Type', 'application/json')
        .send(payload)
        .expect(401));

    it('valid signature → 200 OK', async () => {
      const sig = createHmac('sha256', 'test-webhook-secret').update(payload).digest('hex');
      await request(app.getHttpServer())
        .post('/lemonsqueezy/webhook')
        .set('X-Signature', sig)
        .set('Content-Type', 'application/json')
        .send(payload)
        .expect(200);
    });
  });

  describe('lemonsqueezy service: signature verification unit checks', () => {
    it('rejects tampered body', async () => {
      // Instantiate with a dummy prisma (not used by this method)
      const svc = new LemonsqueezyService(prismaStub as any);
      const body = JSON.stringify({ hello: 'world' });
      const goodSig = createHmac('sha256', 'test-webhook-secret').update(body).digest('hex');
      await expect(svc.verifyWebhookSignature(body, goodSig)).resolves.toBe(true);
      const tampered = JSON.stringify({ hello: 'h4cked' });
      await expect(svc.verifyWebhookSignature(tampered, goodSig)).resolves.toBe(false);
      await expect(svc.verifyWebhookSignature(body, '')).resolves.toBe(false);
    });
  });

  describe('SSRF guard on scan-github payload shape', () => {
    it('non-github URLs still hit the 401 auth wall first', () =>
      request(app.getHttpServer())
        .post('/ai/scan-github')
        .send({ githubUrl: 'http://169.254.169.254/latest/meta-data' })
        .expect(401));
  });

  describe('free-tier pinning: requested model sticks to its provider', () => {
    it("'auto' (FreeLLM) never falls back to paid providers", async () => {
      process.env.FREE_LLM_API_KEY = 'test-free-key';
      process.env.OPENAI_API_KEY = 'test-paid-key'; // paid provider is configured...
      // FreeLLM points at localhost:3001 which isn't running → both FreeLLM models fail...
      await expect(gateway.generateText({ requested: 'auto', prompt: 'hi' }))
        .rejects.toThrow(/Auto Router[\s\S]*Fusion/); // ...and the error lists ONLY FreeLLM models
      delete process.env.FREE_LLM_API_KEY;
      delete process.env.OPENAI_API_KEY;
    });

    it("unknown requested id falls back across providers", async () => {
      process.env.FREE_LLM_API_KEY = 'test-free-key';
      await expect(gateway.generateText({ requested: 'totally-unknown-model', prompt: 'hi' }))
        .rejects.toThrow(/Auto Router/);
      delete process.env.FREE_LLM_API_KEY;
    });
  });
});
