import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql as drizzleSql } from "drizzle-orm";

const connectionString =
  process.env.NODE_ENV! === "development"
    ? process.env.DATABASE_DEV!
    : process.env.DATABASE_PROD!;

if (!connectionString) {
  throw new Error(
    `Missing database connection string for NODE_ENV=${process.env.NODE_ENV}`,
  );
}

const sql = neon(connectionString);
const db = drizzle({ client: sql });

export async function checkDbConnection(): Promise<void> {
  await db.execute(drizzleSql`select 1`);
}

export default db;
