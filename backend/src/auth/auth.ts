import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['info'] });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      tokenBalance: {
        type: "number"
      },
      subscriptionTier: {
        type: "string"
      },
      subscriptionStatus: {
        type: "string"
      },
      polarCustomerId: {
        type: "string",
        returned: false // Do not expose sensitive IDs to the frontend
      }
    }
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }
  },
  trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:3000'],
});
