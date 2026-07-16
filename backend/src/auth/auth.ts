import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient({ log: ['info'] });
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`\n========================================`);
      console.log(`[Email Verification URL for ${user.email}]:`);
      console.log(url);
      console.log(`========================================\n`);
      
      if (!process.env.RESEND_API_KEY) {
        return;
      }
      try {
        await resend.emails.send({
          from: 'StackGen <noreply@stackgen.site>',
          to: user.email,
          subject: 'Verify your email address - StackGen',
          html: `<p>Hi ${user.name},</p><p>Welcome to StackGen! Please verify your email by clicking the link below:</p><br/><a href="${url}" style="padding: 10px 20px; background-color: #9333ea; color: white; border-radius: 6px; text-decoration: none;">Verify my email</a>`
        });
      } catch (err) {
        console.error('Failed to send verification email', err);
      }
    },
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
      paddleCustomerId: {
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
  trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:3000', 'https://stackgen.site', 'https://www.stackgen.site'],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true
    }
  }
});
