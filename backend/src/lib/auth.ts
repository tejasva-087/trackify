import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db.js";
import * as schema from "../schemas/schema.js";
import { sendMail } from "../services/email.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      void sendMail({
        to: user.email,
        subject: "Reset your password",
        body: `<p>Click the link below to reset your password:</p><p><a href="${url}">${url}</a></p>`,
      }).catch((err) => {
        console.error("Failed to send reset password email:", err);
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
