CREATE TABLE IF NOT EXISTS "boards" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer,
	"title" text,
	"description" text,
	"image" text,
	"listOrder" integer[],
	"creatorId" integer,
	CONSTRAINT "boards_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"name" text,
	"systemName" text,
	"description" text,
	"ownerId" integer,
	"members" integer[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer,
	"title" text,
	"description" text,
	"expire" text,
	"priority" smallint DEFAULT 0 NOT NULL,
	"subtasks" json,
	"creatorId" integer,
	"assigneeId" integer[],
	"taskListId" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "tasks_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_groups" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer,
	"title" text,
	"description" text,
	"color" text,
	"creatorId" integer,
	CONSTRAINT "task_groups_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks_to_groups" (
	"taskId" integer NOT NULL,
	"taskGroupId" integer NOT NULL,
	CONSTRAINT "tasks_to_groups_taskId_taskGroupId_pk" PRIMARY KEY("taskId","taskGroupId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_lists" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer,
	"title" text,
	"description" text,
	"color" text,
	"creatorId" integer,
	CONSTRAINT "task_lists_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"title" text,
	"description" text,
	"image" text,
	"leaderId" integer,
	"members" integer[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"lastVisitAt" timestamp DEFAULT now() NOT NULL,
	"isEmailVerified" boolean DEFAULT false,
	"isCookieAccepted" boolean DEFAULT false,
	"firstName" text,
	"lastName" text,
	"image" text,
	"phone" text,
	"currentProjectId" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks_to_groups" ADD CONSTRAINT "tasks_to_groups_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks_to_groups" ADD CONSTRAINT "tasks_to_groups_taskGroupId_task_groups_id_fk" FOREIGN KEY ("taskGroupId") REFERENCES "public"."task_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
