import {
  boolean,
  date,
  index,
  numeric,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

// Supabase owns this table. It is referenced for foreign keys, never created by our migrations.
export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const expenseType = pgEnum("expense_type", ["income", "expense"]);
export const reminderRepeat = pgEnum("reminder_repeat", [
  "none",
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);

const userId = () =>
  uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" });
const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const expenseCategories = pgTable(
  "expense_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => authUsers.id, {
      onDelete: "cascade",
    }),
    name: text("name").notNull(),
    type: expenseType("type").notNull().default("expense"),
    createdAt: createdAt(),
  },
  (table) => [index("expense_categories_user_id_idx").on(table.userId)],
);

export const expenses = pgTable(
  "expenses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: userId(),
    categoryId: uuid("category_id").references(() => expenseCategories.id, {
      onDelete: "set null",
    }),
    type: expenseType("type").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    description: text("description").notNull().default(""),
    occurredOn: date("occurred_on").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("expenses_user_occurred_idx").on(table.userId, table.occurredOn),
    index("expenses_user_category_idx").on(table.userId, table.categoryId),
  ],
);

export const reminders = pgTable(
  "reminders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: userId(),
    title: text("title").notNull(),
    details: text("details").notNull().default(""),
    remindAt: timestamp("remind_at", { withTimezone: true }).notNull(),
    repeat: reminderRepeat("repeat").notNull().default("none"),
    completed: boolean("completed").notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("reminders_user_remind_at_idx").on(table.userId, table.remindAt),
    index("reminders_user_completed_idx").on(table.userId, table.completed),
  ],
);

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: userId(),
    title: text("title").notNull().default(""),
    content: text("content").notNull().default(""),
    pinned: boolean("pinned").notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("notes_user_pinned_updated_idx").on(
      table.userId,
      table.pinned,
      table.updatedAt,
    ),
  ],
);

export const userSettings = pgTable("user_settings", {
  userId: userId().primaryKey(),
  currency: text("currency").notNull().default("NPR"),
  locale: text("locale").notNull().default("en"),
  timezone: text("timezone").notNull().default("Asia/Kathmandu"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type Profile = typeof profiles.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export type Reminder = typeof reminders.$inferSelect;
export type NewReminder = typeof reminders.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type ExpenseCategory = typeof expenseCategories.$inferSelect;
