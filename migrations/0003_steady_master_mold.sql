CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_number" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_by" uuid NOT NULL,
	"max_participants" integer DEFAULT 10 NOT NULL,
	"is_private" text DEFAULT 'false' NOT NULL,
	"is_active" text DEFAULT 'true' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "rooms_room_number_unique" UNIQUE("room_number")
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "name" TO "username";--> statement-breakpoint
-- ALTER TABLE "messages" DROP CONSTRAINT "messages_id_unique";--> statement-breakpoint
-- ALTER TABLE "users" DROP CONSTRAINT "users_id_unique";--> statement-breakpoint
-- ALTER TABLE "messages" DROP CONSTRAINT "messages_receiver_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "room_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "message_type" text DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "attachments" text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "reply_to" uuid;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "is_edited" text DEFAULT 'false' NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "is_deleted" text DEFAULT 'false' NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "status" DEFAULT 'OFFLINE' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_number_rooms_room_number_fk" FOREIGN KEY ("room_number") REFERENCES "public"."rooms"("room_number") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "receiver_id";--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "timestamp";