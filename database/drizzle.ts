import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import config from "@/lib/config";
// import 'dotenv/config';

const databaseUrl = config.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/dev";
const sql = neon(databaseUrl);

export const db = drizzle({ client: sql });
