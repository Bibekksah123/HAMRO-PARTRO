"use server";

import { and, eq } from "drizzle-orm";
import { notes } from "@merodin/db";
import { noteInputSchema, validationMessage } from "@merodin/validation";
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

function refreshNotes() {
  revalidatePath("/my/notes");
  revalidatePath("/my");
}

export async function saveNote(formData: FormData) {
  const parsed = noteInputSchema.safeParse(formValues(formData));
  if (!parsed.success)
    return { ok: false, message: validationMessage(parsed.error) };
  const user = await requireCurrentUser();
  try {
    const db = createDatabase();
    const values = {
      title: parsed.data.title,
      content: parsed.data.content,
      pinned: parsed.data.pinned === "true",
      updatedAt: new Date(),
    };
    if (parsed.data.id) {
      const [updated] = await db
        .update(notes)
        .set(values)
        .where(and(eq(notes.id, parsed.data.id), eq(notes.userId, user.id)))
        .returning({ id: notes.id });
      if (!updated)
        return { ok: false, message: "That note could not be found." };
    } else {
      await db.insert(notes).values({ ...values, userId: user.id });
    }
    refreshNotes();
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "We could not save this note. Please try again.",
    };
  }
}

export async function setNotePinned(id: string, pinned: boolean) {
  if (!validId(id))
    return { ok: false, message: "That note could not be found." };
  const user = await requireCurrentUser();
  try {
    const [updated] = await createDatabase()
      .update(notes)
      .set({ pinned, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .returning({ id: notes.id });
    if (!updated)
      return { ok: false, message: "That note could not be found." };
    refreshNotes();
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "We could not update this note. Please try again.",
    };
  }
}

export async function deleteNote(id: string) {
  if (!validId(id))
    return { ok: false, message: "That note could not be found." };
  const user = await requireCurrentUser();
  try {
    const [deleted] = await createDatabase()
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .returning({ id: notes.id });
    if (!deleted)
      return { ok: false, message: "That note could not be found." };
    refreshNotes();
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "We could not delete this note. Please try again.",
    };
  }
}
