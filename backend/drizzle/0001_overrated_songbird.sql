CREATE TYPE "public"."priority" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('scheduled', 'conflicted', 'resolved');--> statement-breakpoint
CREATE TABLE "event" (
	"userId" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start" timestamp with time zone,
	"end" timestamp with time zone,
	"allDay" boolean DEFAULT false,
	"url" text,
	"color" text,
	"contrastColor" text,
	"daysOfWeek" integer[],
	"startRecur" date,
	"endRecur" date,
	"startTime" text,
	"endTime" text,
	"editable" boolean,
	"priority" "priority",
	"status" "status",
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;