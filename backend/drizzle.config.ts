import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.NODE_ENV! === "development"
        ? process.env.DATABASE_DEV!
        : process.env.DATABASE_PROD!,
  },
});
