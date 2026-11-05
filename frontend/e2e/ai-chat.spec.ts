import { test, expect, Page } from '@playwright/test';

/**
 * Frontend e2e with a fully mocked backend API.
 * No live server, database, or AI keys required — routes are intercepted.
 */

const models = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'Google', available: true },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI', available: true },
  { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', provider: 'Anthropic', available: false },
];

export async function mockSession(page: Page, user?: { id: string; email: string; name: string } | null) {
  // NOTE: Playwright routes are matched last-registered-first, so the catch-all
  // must be registered BEFORE the more specific get-session route.
  await page.route('**/api/auth/**', route => route.fulfill({ json: {} }));
  await page.route('**/api/auth/get-session', route =>
    route.fulfill({ json: user ? { user, session: { id: 's1', userId: user.id } } : null }));
}

async function mockCoreApi(page: Page) {
  await page.route('**/ai/models', route => route.fulfill({ json: models }));
  await page.route('**/ai/generate-blueprint', route =>
    route.fulfill({ json: { techStack: [{ name: 'Next.js', rationale: 'r' }], checklist: [], nodes: [], edges: [] } }));
  await page.route('**/projects', route => route.fulfill({ json: [] }));
}

// AiChatPanel only renders once a project exists, so run the wizard first
async function createProject(page: Page) {
  await page.goto('/dashboard');
  await page.getByPlaceholder(/Describe your application/).fill('A marketplace for local services');
  await page.keyboard.press('Enter'); // wizard submits on Enter
  const openBtn = page.locator('button.fixed.z-50');
  await openBtn.waitFor({ state: 'visible', timeout: 15_000 });
  return openBtn;
}

const chatOpenBtn = 'button.fixed.z-50';

test.describe('AI chat panel + model switching', () => {
  test('model selector lists only available models, persists choice, sends model id', async ({ page }) => {
    await mockCoreApi(page);
    await mockSession(page, { id: 'u1', email: 'dev@test.com', name: 'Dev' });

    const openBtn = await createProject(page);
    await openBtn.click();

    // Model list loads from /ai/models
    const selector = page.locator('select');
    await expect(selector).toBeVisible({ timeout: 15_000 });

    const options = selector.locator('option');
    await expect(options).toHaveCount(2); // unavailable model hidden
    await expect(options.filter({ hasText: 'Claude' })).toHaveCount(0);

    // Selection persists
    await selector.selectOption('gpt-4o-mini');
    expect(await page.evaluate(() => localStorage.getItem('stackgenSelectedModel'))).toBe('gpt-4o-mini');

    // The selected model id is sent with the chat payload
    let sentModel: string | undefined;
    await page.route('**/ai/chat', async route => {
      sentModel = (route.request().postDataJSON() as { model?: string }).model;
      route.fulfill({ json: { reply: 'Mocked AI reply' } });
    });
    await page.getByPlaceholder('Ask about your architecture...').fill('What DB should I use?');
    await page.locator('form button[type="submit"]').click();
    await expect(page.getByText('Mocked AI reply')).toBeVisible({ timeout: 10_000 });
    expect(sentModel).toBe('gpt-4o-mini');
  });

  test('chat shows login message on 401', async ({ page }) => {
    await mockCoreApi(page);
    await mockSession(page, { id: 'u1', email: 'dev@test.com', name: 'Dev' });

    const openBtn = await createProject(page);
    await openBtn.click();
    await page.getByPlaceholder('Ask about your architecture...').fill('hello');
    await page.route('**/ai/chat', route => route.fulfill({ status: 401, json: {} }));
    await page.locator('form button[type="submit"]').click();
    await expect(page.getByText('Please log in to use the AI assistant.')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Auth gating', () => {
  test('anonymous visitor on /dashboard is redirected to /auth', async ({ page }) => {
    await mockSession(page, null);
    await page.goto('/dashboard');
    await page.waitForURL('**/auth', { timeout: 15_000 });
    expect(page.url()).toContain('/auth');
  });
});

test.describe('Pricing → Lemon Squeezy checkout', () => {
  test('anonymous user clicking paid tier is sent to /auth', async ({ page }) => {
    await mockSession(page, null);
    await page.goto('/');
    await page.getByRole('button', { name: 'Get started' }).nth(1).click(); // Startup tier
    await page.waitForURL('**/auth', { timeout: 15_000 });
  });

  test('logged-in user gets a checkout URL for the right tier', async ({ page }) => {
    await mockSession(page, { id: 'u1', email: 'dev@test.com', name: 'Dev' });
    await page.goto('/');

    let sentTier: string | undefined;
    await page.route('**/lemonsqueezy/checkout', async route => {
      sentTier = (route.request().postDataJSON() as { tier?: string }).tier;
      route.fulfill({ json: { url: 'https://checkout.lemonsqueezy.com/mock' } });
    });

    const startupBtn = page.getByRole('button', { name: 'Get started' }).nth(1); // Startup is 2nd card
    await startupBtn.click();
    await expect(sentTier).toBe('startup');
  });
});

test.describe('GitHub scanner 401 UX', () => {
  test('shows login banner when unauthenticated', async ({ page }) => {
    await mockSession(page, { id: 'u1', email: 'dev@test.com', name: 'Dev' });
    await page.route('**/ai/scan-github', route => route.fulfill({ status: 401, json: {} }));
    await page.goto('/scanner');
    await page.getByPlaceholder('https://github.com/facebook/react').fill('https://github.com/facebook/react');
    await page.getByRole('button', { name: 'Scan Repository' }).click();
    await expect(page.getByText('Please log in to use the scanner.')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  });
});
