CREATE TABLE IF NOT EXISTS "teamsToBoards" (
	"team_id" integer NOT NULL,
	"board_id" integer NOT NULL,
	CONSTRAINT "teamsToBoards_team_id_board_id_pk" PRIMARY KEY("team_id","board_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boards" (
	"_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"relative_id" integer DEFAULT 0 NOT NULL,
	"project_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"task_lists" json DEFAULT '[]' NOT NULL,
	"creator_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"relative_id" integer DEFAULT 0 NOT NULL,
	"project_id" integer NOT NULL,
	"board_id" integer NOT NULL,
	"content" text NOT NULL,
	"rating" smallint DEFAULT 0 NOT NULL,
	"creator_id" integer NOT NULL,
	"task_id" integer NOT NULL,
	"parent_comment_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"relative_id" integer DEFAULT 0 NOT NULL,
	"project_id" integer NOT NULL,
	"board_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"path" text NOT NULL,
	"type" text NOT NULL,
	"size" text NOT NULL,
	"creator_id" integer NOT NULL,
	"task_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labels" (
	"_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"relative_id" integer DEFAULT 0 NOT NULL,
	"project_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"color" text DEFAULT '' NOT NULL,
	"creator_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"owner_id" integer NOT NULL,
	"admin_ids" integer[] NOT NULL,
	"member_ids" integer[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"relative_id" integer DEFAULT 0 NOT NULL,
	"project_id" integer NOT NULL,
	"board_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"expire" text DEFAULT '' NOT NULL,
	"priority" smallint DEFAULT 0 NOT NULL,
	"subtasks" json DEFAULT '[]' NOT NULL,
	"creator_id" integer NOT NULL,
	"assignee_ids" integer[] NOT NULL,
	"task_list_id" integer NOT NULL,
	"label_ids" integer[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"relative_id" integer DEFAULT 0 NOT NULL,
	"project_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"leader_id" integer NOT NULL,
	"member_ids" integer[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"is_cookie_accepted" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"last_visit_at" timestamp DEFAULT now() NOT NULL,
	"refresh_tokens" text[] NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersInfo" (
	"_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"avatar" text DEFAULT '' NOT NULL,
	"status" text DEFAULT '' NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamsToBoards" ADD CONSTRAINT "teamsToBoards_team_id_teams__id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamsToBoards" ADD CONSTRAINT "teamsToBoards_board_id_boards__id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boards" ADD CONSTRAINT "boards_project_id_projects__id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_project_id_projects__id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_board_id_boards__id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_project_id_projects__id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_board_id_boards__id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels" ADD CONSTRAINT "labels_project_id_projects__id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects__id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_board_id_boards__id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_project_id_projects__id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersInfo" ADD CONSTRAINT "usersInfo_user_id_users__id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
