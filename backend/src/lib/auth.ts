import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db.js";

import { user } from "../schemas/user.js";
import { session } from "../schemas/session.js";
import { account } from "../schemas/account.js";
import { verification } from "../schemas/verification.js";
import { sendMail } from "../services/email.js";

const TOKEN_EXPIRATION = 10 * 60 * 1000;

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

  // blocks sign-in until verified — needed for req #2/#3
  requireEmailVerification: true,
  minPasswordLength: 8,
  // don't log them in until they verify (matches your redirect flow)
  autoSignIn: false,
  // revoke all sessions after signup
  revokeSessionsOnPasswordReset: true,

  emailAndPassword: {
    enabled: true,

    // Mails if any new account is signed up
    onExistingUserSignUp: async ({ user }, _request) => {
      console.log("SOME USER TRIED TO SIGN UP USING THE SAME EMAIL");
      // void sendMail({
      //   to: user.email,
      //   subject: "Sign-up attempt with your email",
      //   body: "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.",
      // });
    },

    // Password reset mail
    sendResetPassword: async ({ user, url }, _request) => {
      console.log("PASSWORD RESET URL:", url);
      // void sendMail({
      //   to: user.email,
      //   subject: "Reset your password",
      //   body: `Click the link to reset your password: ${url}`,
      // });
    },
    resetPasswordTokenExpiresIn: TOKEN_EXPIRATION,

    // Password reset successful mail
    onPasswordReset: async ({ user }, _request) => {
      // void sendMail({
      //   to: user.email,
      //   subject: "Password-reset successful",
      //   body: "Your password has been reset.",
      // });
    },
  },

  // Email verification mailer
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, _request) => {
      // void sendMail({
      //   to: user.email,
      //   subject: "Verify your email address",
      //   body: `Click the link to verify your email: ${url}`,
      // });
      console.log("EMAIL VERIFICATION URL:", url);
    },

    // log them in once they click the link
    autoSignInAfterVerification: true,
    // auto-send on sign up
    sendOnSignUp: true,
    expiresIn: TOKEN_EXPIRATION,
  },

  // Change email while logged in (req #7)
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        // sent to the CURRENT email, confirming the change was requested
        // void sendMail({
        //   to: user.email,
        //   subject: "Confirm your email change",
        //   body: `Click the link to verify your new email ${newEmail}: ${url}`,
        // });

        console.log("NEW EMAIL VERIFICATION URL: ", url);
      },
    },
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

  // needed when frontend and backend are on different ports (localhost:5173 vs :3000)
  advanced: {
    crossSubDomainCookies: { enabled: false },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },

  // Rate limiting for sign in and forgot password
  rateLimit: {
    enabled: true,
    window: 60, // seconds
    max: 10, // default max requests per window
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/forget-password": { window: 60, max: 3 },
    },
  },
});
