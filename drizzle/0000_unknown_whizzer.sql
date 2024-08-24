CREATE TABLE IF NOT EXISTS "teamsToBoards" (
	"teamId" integer NOT NULL,
	"boardId" integer NOT NULL,
	CONSTRAINT "teamsToBoards_teamId_boardId_pk" PRIMARY KEY("teamId","boardId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boards" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image" text,
	"listOrder" integer[],
	"creatorId" integer NOT NULL,
	CONSTRAINT "boards_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"boardId" integer NOT NULL,
	"content" text NOT NULL,
	"rating" smallint DEFAULT 0 NOT NULL,
	"authorId" integer NOT NULL,
	"taskId" integer NOT NULL,
	"parentCommentId" integer,
	CONSTRAINT "comments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"boardId" integer NOT NULL,
	"title" text,
	"description" text,
	"path" text NOT NULL,
	"type" text NOT NULL,
	"size" text NOT NULL,
	"authorId" integer NOT NULL,
	"taskId" integer NOT NULL,
	CONSTRAINT "files_id_unique" UNIQUE("id"),
	CONSTRAINT "files_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labels" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"color" text,
	"creatorId" integer NOT NULL,
	CONSTRAINT "labels_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"title" text NOT NULL,
	"description" text,
	"ownerId" integer NOT NULL,
	"adminIds" integer[],
	"memberIds" integer[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"boardId" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"expire" text,
	"priority" smallint DEFAULT 0 NOT NULL,
	"subtasks" json,
	"creatorId" integer NOT NULL,
	"assigneeIds" integer[],
	"labelIds" integer[],
	"taskListId" integer NOT NULL,
	CONSTRAINT "tasks_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskLists" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"boardId" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"color" text,
	"creatorId" integer NOT NULL,
	CONSTRAINT "taskLists_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"globalId" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image" text,
	"leaderId" integer NOT NULL,
	"memberIds" integer[] NOT NULL,
	CONSTRAINT "teams_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
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
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamsToBoards" ADD CONSTRAINT "teamsToBoards_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamsToBoards" ADD CONSTRAINT "teamsToBoards_boardId_boards_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boards" ADD CONSTRAINT "boards_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_boardId_boards_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_boardId_boards_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels" ADD CONSTRAINT "labels_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_boardId_boards_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_taskListId_taskLists_id_fk" FOREIGN KEY ("taskListId") REFERENCES "public"."taskLists"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskLists" ADD CONSTRAINT "taskLists_boardId_boards_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
