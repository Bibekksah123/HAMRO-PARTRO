"use server";

import { and, eq } from "drizzle-orm";
import { reminders } from "@merodin/db";
import { reminderInputSchema, validationMessage } from "@merodin/validation";
import { revalidatePath } from "next/cache";
import { createDatabase } from "@/lib/db";
import { requireCurrentUser } from "@/lib/supabase/current-user";

function formValues(formData: FormData): Record<string, string> {
  return Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [
      key,
      typeof value === "string" ? value : "",
    ]),
  );
}

function validId(value: string) {
  return /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value);
}

function refreshReminders() {
  revalidatePath("/my/reminders");
  revalidatePath("/my");
}

export async function saveReminder(formData: FormData) {
  const parsed = reminderInputSchema.safeParse(formValues(formData));
  if (!parsed.success)
    return { ok: false, message: validationMessage(parsed.error) };
  const user = await requireCurrentUser();
  const remindAt = new Date(`${parsed.data.remindAt}:00+05:45`);
  try {
    const db = createDatabase();
    const values = {
      title: parsed.data.title,
      details: parsed.data.details,
      remindAt,
      repeat: parsed.data.repeat,
      updatedAt: new Date(),
    };
    if (parsed.data.id) {
      const [updated] = await db
        .update(reminders)
        .set(values)
        .where(
          and(eq(reminders.id, parsed.data.id), eq(reminders.userId, user.id)),
        )
        .returning({ id: reminders.id });
      if (!updated)
        return { ok: false, message: "That reminder could not be found." };
    } else {
      await db.insert(reminders).values({ ...values, userId: user.id });
    }
    refreshReminders();
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "We could not save this reminder. Please try again.",
    };
  }
}

export async function toggleReminder(id: string) {
  if (!validId(id))
    return { ok: false, message: "That reminder could not be found." };
  const user = await requireCurrentUser();
  try {
    const db = createDatabase();
    const [existing] = await db
      .select({ completed: reminders.completed })
      .from(reminders)
      .where(and(eq(reminders.id, id), eq(reminders.userId, user.id)))
      .limit(1);
    if (!existing)
      return { ok: false, message: "That reminder could not be found." };
    await db
      .update(reminders)
      .set({ completed: !existing.completed, updatedAt: new Date() })
      .where(and(eq(reminders.id, id), eq(reminders.userId, user.id)));
    refreshReminders();
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "We could not update this reminder. Please try again.",
    };
  }
}

export async function deleteReminder(id: string) {
  if (!validId(id))
    return { ok: false, message: "That reminder could not be found." };
  const user = await requireCurrentUser();
  try {
    const [deleted] = await createDatabase()
      .delete(reminders)
      .where(and(eq(reminders.id, id), eq(reminders.userId, user.id)))
      .returning({ id: reminders.id });
    if (!deleted)
      return { ok: false, message: "That reminder could not be found." };
    refreshReminders();
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "We could not delete this reminder. Please try again.",
    };
  }
}
