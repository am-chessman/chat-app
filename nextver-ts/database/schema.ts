import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("status", ["ONLINE", "OFFLINE", "AWAY"]);
// export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom().notNull().unique(),
    username: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
    id: uuid('id').primaryKey().notNull().unique(),
    senderId: uuid("sender_id").notNull().references(() => users.id),
    receiverId: uuid("receiver_id").notNull().references(() => users.id),
    content: text("content").notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
});