import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db.js";

import { user } from "../schemas/user.js";
import { session } from "../schemas/session.js";
import { account } from "../schemas/account.js";
import { verification } from "../schemas/verification.js";
import { sendMail } from "../services/email.js";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_TRUSTED_ORIGIN as string],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  emailAndPassword: {
    enabled: true,

    // Mails if any new account is signed up
    onExistingUserSignUp: async ({ user }, _request) => {
      console.log("user already exist");
      void sendMail({
        to: user.email,
        subject: "Sign-up attempt with your email",
        body: "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.",
      });
    },

    // require email to be verified
    requireEmailVerification: true,

    // revoke all sessions after signup
    revokeSessionsOnPasswordReset: true,

    // Password reset mail
    sendResetPassword: async ({ user, url, token }, _request) => {
      console.log("URL:", url);
      console.log("TOKEN: ", token);
      void sendMail({
        to: user.email,
        subject: "Reset your password",
        body: `Click the link to reset your password: ${url}`,
      });
    },

    // Password reset successful mail
    onPasswordReset: async ({ user }, _request) => {
      console.log("password reset successful");
      void sendMail({
        to: user.email,
        subject: "Password-reset successful",
        body: "Your password has been reset.",
      });
    },
  },

  // Email verification mailer
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, _request) => {
      void sendMail({
        to: user.email,
        subject: "Verify your email address",
        body: `Click the link to verify your email: ${url}`,
      });
    },
    autoSignInAfterVerification: true,
  },

  // If user don't use for 7 days they are logged out
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh session if older than 1 day
    cookieCache: {
      enabled: true, // cache session in a signed cookie
      maxAge: 60 * 5, // 5 min — avoids DB hit on every request
    },
  },

  // Rate limiting for sign in and forgot password
  // rateLimit: {
  //   enabled: true,
  //   window: 60, // seconds
  //   max: 10, // default max requests per window
  //   customRules: {
  //     "/sign-in/email": { window: 60, max: 5 },
  //     "/forget-password": { window: 60, max: 3 },
  //   },
  // },
});
