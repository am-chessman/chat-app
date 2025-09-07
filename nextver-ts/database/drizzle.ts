import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import config from "@/lib/config";
// import 'dotenv/config';

// console.log("Database URL:", config.env.DATABASE_URL!);
const sql = neon(config.env.DATABASE_URL!);

export const db = drizzle({ client: sql });
