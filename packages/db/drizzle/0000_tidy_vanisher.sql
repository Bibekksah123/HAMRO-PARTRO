CREATE TYPE "public"."expense_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TYPE "public"."reminder_repeat" AS ENUM('none', 'daily', 'weekly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TABLE "expense_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL,
	"type" "expense_type" DEFAULT 'expense' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" uuid,
	"type" "expense_type" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"occurred_on" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"details" text DEFAULT '' NOT NULL,
	"remind_at" timestamp with time zone NOT NULL,
	"repeat" "reminder_repeat" DEFAULT 'none' NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"currency" text DEFAULT 'NPR' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"timezone" text DEFAULT 'Asia/Kathmandu' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_expense_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."expense_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "expense_categories_user_id_idx" ON "expense_categories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "expenses_user_occurred_idx" ON "expenses" USING btree ("user_id","occurred_on");--> statement-breakpoint
CREATE INDEX "expenses_user_category_idx" ON "expenses" USING btree ("user_id","category_id");--> statement-breakpoint
CREATE INDEX "notes_user_pinned_updated_idx" ON "notes" USING btree ("user_id","pinned","updated_at");--> statement-breakpoint
CREATE INDEX "reminders_user_remind_at_idx" ON "reminders" USING btree ("user_id","remind_at");--> statement-breakpoint
CREATE INDEX "reminders_user_completed_idx" ON "reminders" USING btree ("user_id","completed");--> statement-breakpoint
INSERT INTO "expense_categories" ("name", "type") VALUES
	('Food', 'expense'),
	('Transport', 'expense'),
	('Rent', 'expense'),
	('Education', 'expense'),
	('Shopping', 'expense'),
	('Entertainment', 'expense'),
	('Health', 'expense'),
	('Bills', 'expense'),
	('Other', 'expense'),
	('Salary', 'income'),
	('Other income', 'income');--> statement-breakpoint
-- Supabase owns auth.users; application tables reference it but never create it.
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "expense_categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "expenses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "reminders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "profiles_owner_all" ON "profiles" FOR ALL TO authenticated USING ((select auth.uid()) = "id") WITH CHECK ((select auth.uid()) = "id");--> statement-breakpoint
CREATE POLICY "expense_categories_read_available" ON "expense_categories" FOR SELECT TO anon, authenticated USING ("user_id" IS NULL OR (select auth.uid()) = "user_id");--> statement-breakpoint
CREATE POLICY "expense_categories_owner_insert" ON "expense_categories" FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = "user_id");--> statement-breakpoint
CREATE POLICY "expense_categories_owner_update" ON "expense_categories" FOR UPDATE TO authenticated USING ((select auth.uid()) = "user_id") WITH CHECK ((select auth.uid()) = "user_id");--> statement-breakpoint
CREATE POLICY "expense_categories_owner_delete" ON "expense_categories" FOR DELETE TO authenticated USING ((select auth.uid()) = "user_id");--> statement-breakpoint
CREATE POLICY "expenses_owner_all" ON "expenses" FOR ALL TO authenticated USING ((select auth.uid()) = "user_id") WITH CHECK ((select auth.uid()) = "user_id");--> statement-breakpoint
CREATE POLICY "reminders_owner_all" ON "reminders" FOR ALL TO authenticated USING ((select auth.uid()) = "user_id") WITH CHECK ((select auth.uid()) = "user_id");--> statement-breakpoint
CREATE POLICY "notes_owner_all" ON "notes" FOR ALL TO authenticated USING ((select auth.uid()) = "user_id") WITH CHECK ((select auth.uid()) = "user_id");--> statement-breakpoint
CREATE POLICY "user_settings_owner_all" ON "user_settings" FOR ALL TO authenticated USING ((select auth.uid()) = "user_id") WITH CHECK ((select auth.uid()) = "user_id");--> statement-breakpoint
GRANT SELECT ON "expense_categories" TO anon, authenticated;--> statement-breakpoint
GRANT INSERT, UPDATE, DELETE ON "expense_categories" TO authenticated;--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON "profiles", "expenses", "reminders", "notes", "user_settings" TO authenticated;
