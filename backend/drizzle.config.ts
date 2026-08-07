import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schemas",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.NODE_ENV === "development"
        ? process.env.DATABASE_URL_DEV!
        : process.env.DATABASE_URL_PROD!,
  },
});
