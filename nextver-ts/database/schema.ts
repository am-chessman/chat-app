import { pgTable, uuid, text, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";
import { z } from "zod";

// ===== Enums =====
export const STATUS_ENUM = pgEnum("status", ["ONLINE", "OFFLINE", "AWAY"]);

// ===== Schemas =====
export const UserIdSchema = z.uuid({ message: "Invalid user ID format" });
export const RoomNumberSchema = z
    .string()
    .regex(/^\d{6}$/, "Room number must be 6 digits")
    .transform(Number);

// ===== Users =====
export const UserSchema = z.object({
    id: UserIdSchema,
    username: z.string().min(1, "Username required").max(100),
    email: z.email(),
    avatar: z.url().optional(),
    status: z.enum(["ONLINE", "OFFLINE", "AWAY"]).default("OFFLINE"),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    status: STATUS_ENUM("status").default("OFFLINE").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== Rooms =====
export const RoomSchema = z.object({
    id: UserIdSchema,
    roomNumber: RoomNumberSchema,
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    createdBy: UserIdSchema,
    participants: z.array(UserIdSchema).default([]),
    maxParticipants: z.number().int().min(2).max(100).default(10),
    isPrivate: z.boolean().default(false),
    isActive: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date(),
    expiresAt: z.date().optional(),
});

export const rooms = pgTable("rooms", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    roomNumber: integer("room_number").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    createdBy: uuid("created_by").notNull().references(() => users.id),
    maxParticipants: integer("max_participants").default(10).notNull(),
    isPrivate: text("is_private").default("false").notNull(),
    isActive: text("is_active").default("true").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
});

// ===== Messages =====
export const MessageSchema = z.object({
    id: z.uuid(),
    roomNumber: RoomNumberSchema,
    senderId: UserIdSchema,
    content: z.string().min(1),
    messageType: z.enum(["text", "image", "file", "system"]).default("text"),
    attachments: z
        .array(
            z.object({
                id: z.string(),
                fileName: z.string(),
                fileSize: z.number(),
                mimeType: z.string(),
                url: z.string(),
            })
        )
        .default([]),
    replyTo: z.uuid().optional(),
    isEdited: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const messages = pgTable("messages", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    roomNumber: integer("room_number").notNull().references(() => rooms.roomNumber),
    senderId: uuid("sender_id").notNull().references(() => users.id),
    content: text("content").notNull(),
    messageType: text("message_type").default("text").notNull(),
    attachments: text("attachments").default("[]").notNull(), // store JSON string
    replyTo: uuid("reply_to"),
    isEdited: text("is_edited").default("false").notNull(),
    isDeleted: text("is_deleted").default("false").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
