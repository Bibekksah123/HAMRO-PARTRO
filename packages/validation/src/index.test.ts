import { describe, expect, it } from "bun:test";
import {
  expenseInputSchema,
  noteInputSchema,
  reminderInputSchema,
} from "./index";

describe("personal data validation", () => {
  it("accepts a valid expense and rejects malformed amounts and dates", () => {
    const valid = expenseInputSchema.safeParse({
      type: "expense",
      amount: "125.50",
      categoryId: "",
      description: "Groceries",
      occurredOn: "2026-09-28",
    });
    expect(valid.success).toBe(true);
    expect(
      expenseInputSchema.safeParse({
        type: "expense",
        amount: "-2",
        categoryId: "",
        description: "",
        occurredOn: "2026-02-30",
      }).success,
    ).toBe(false);
  });

  it("accepts recurrence options and rejects invalid reminder dates", () => {
    expect(
      reminderInputSchema.safeParse({
        title: "Pay rent",
        details: "",
        remindAt: "2026-10-01T09:30",
        repeat: "monthly",
      }).success,
    ).toBe(true);
    expect(
      reminderInputSchema.safeParse({
        title: "Bad date",
        details: "",
        remindAt: "2026-02-30T09:30",
        repeat: "sometimes",
      }).success,
    ).toBe(false);
  });

  it("bounds note length and accepts pin state", () => {
    expect(
      noteInputSchema.safeParse({
        title: "Shopping",
        content: "Milk",
        pinned: "true",
      }).success,
    ).toBe(true);
    expect(
      noteInputSchema.safeParse({
        title: "",
        content: "x".repeat(10_001),
        pinned: "false",
      }).success,
    ).toBe(false);
  });
});
