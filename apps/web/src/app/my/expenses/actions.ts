"use server";

import { and, eq, isNull, or } from "drizzle-orm";
import { expenseCategories, expenses } from "@merodin/db";
import {
  expenseCategoryInputSchema,
  expenseInputSchema,
  validationMessage,
} from "@merodin/validation";
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

function invalidIdentifier(value: string) {
  return !/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value);
}

function refreshExpenses() {
  revalidatePath("/my/expenses");
  revalidatePath("/my");
}

export async function saveExpense(formData: FormData) {
  const parsed = expenseInputSchema.safeParse(formValues(formData));
  if (!parsed.success)
    return { ok: false, message: validationMessage(parsed.error) };
  const user = await requireCurrentUser();
  const categoryId = parsed.data.categoryId || null;

  try {
    const db = createDatabase();
    if (categoryId) {
      const [category] = await db
        .select({ id: expenseCategories.id, type: expenseCategories.type })
        .from(expenseCategories)
        .where(
          and(
            eq(expenseCategories.id, categoryId),
            or(
              isNull(expenseCategories.userId),
              eq(expenseCategories.userId, user.id),
            ),
          ),
        )
        .limit(1);
      if (!category || category.type !== parsed.data.type) {
        return {
          ok: false,
          message: "Choose a category for this transaction type.",
        };
      }
    }

    const values = {
      type: parsed.data.type,
      amount: parsed.data.amount.toFixed(2),
      categoryId,
      description: parsed.data.description,
      occurredOn: parsed.data.occurredOn,
      updatedAt: new Date(),
    };
    const id = parsed.data.id;
    if (id) {
      const [updated] = await db
        .update(expenses)
        .set(values)
        .where(and(eq(expenses.id, id), eq(expenses.userId, user.id)))
        .returning({ id: expenses.id });
      if (!updated)
        return { ok: false, message: "That transaction could not be found." };
    } else {
      await db.insert(expenses).values({ ...values, userId: user.id });
    }
    refreshExpenses();
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "We could not save this transaction. Please try again.",
    };
  }
}

export async function addExpenseCategory(formData: FormData) {
  const parsed = expenseCategoryInputSchema.safeParse(formValues(formData));
  if (!parsed.success)
    return { ok: false, message: validationMessage(parsed.error) };
  const user = await requireCurrentUser();
  try {
    await createDatabase().insert(expenseCategories).values({
      userId: user.id,
      name: parsed.data.name,
      type: parsed.data.type,
    });
    refreshExpenses();
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "We could not add that category. Please try again.",
    };
  }
}

export async function deleteExpense(id: string) {
  if (invalidIdentifier(id))
    return { ok: false, message: "That transaction could not be found." };
  const user = await requireCurrentUser();
  try {
    const [deleted] = await createDatabase()
      .delete(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.userId, user.id)))
      .returning({ id: expenses.id });
    if (!deleted)
      return { ok: false, message: "That transaction could not be found." };
    refreshExpenses();
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "We could not delete this transaction. Please try again.",
    };
  }
}
