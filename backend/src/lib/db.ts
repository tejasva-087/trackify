import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(
  process.env.NODE_ENV! === "development"
    ? process.env.DATABASE_URL_DEV!
    : process.env.DATABASE_URL_PROD!,
);
export const db = drizzle({ client: sql });
