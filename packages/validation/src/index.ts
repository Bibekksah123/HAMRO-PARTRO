export { z } from "zod";

import { z } from "zod";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "Choose a valid date.");

const amount = z.coerce
  .number()
  .finite("Enter a valid amount.")
  .positive("Amount must be greater than zero.")
  .max(9_999_999_999.99, "Amount is too large.")
  .refine(
    (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-7,
    "Use no more than two decimal places.",
  );

export const expenseInputSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  type: z.enum(["income", "expense"]),
  amount,
  categoryId: z.string().uuid().optional().or(z.literal("")),
  description: z
    .string()
    .trim()
    .max(240, "Description must be 240 characters or fewer."),
  occurredOn: isoDate,
});

export const expenseCategoryInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a category name.")
    .max(48, "Category name must be 48 characters or fewer."),
  type: z.enum(["income", "expense"]),
});

export const reminderInputSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z
    .string()
    .trim()
    .min(1, "Enter a reminder title.")
    .max(120, "Title must be 120 characters or fewer."),
  details: z
    .string()
    .trim()
    .max(1000, "Details must be 1,000 characters or fewer."),
  remindAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Choose a valid date and time.")
    .refine((value) => {
      const [year, month, day, hour, minute] =
        value.match(/\d+/g)?.map(Number) ?? [];
      if ([year, month, day, hour, minute].some((part) => part === undefined))
        return false;
      const date = new Date(Date.UTC(year!, month! - 1, day!));
      return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month! - 1 &&
        date.getUTCDate() === day &&
        hour! < 24 &&
        minute! < 60
      );
    }, "Choose a valid date and time."),
  repeat: z.enum(["none", "daily", "weekly", "monthly", "yearly"]),
});

export const noteInputSchema = z
  .object({
    id: z.string().uuid().optional().or(z.literal("")),
    title: z.string().trim().max(160, "Title must be 160 characters or fewer."),
    content: z
      .string()
      .max(10_000, "Notes must be 10,000 characters or fewer."),
    pinned: z.enum(["true", "false"]),
  })
  .refine((note) => note.title.length > 0 || note.content.trim().length > 0, {
    message: "Add a title or some note text.",
  });

export function validationMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Check your details and try again.";
}
