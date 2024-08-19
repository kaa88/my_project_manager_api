ALTER TABLE "comments" DROP CONSTRAINT "comments_projectId_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "files" DROP CONSTRAINT "files_projectId_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_projectId_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "task_lists" DROP CONSTRAINT "task_lists_projectId_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "boardId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "boardId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "boardId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_boardId_boards_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_boardId_boards_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
