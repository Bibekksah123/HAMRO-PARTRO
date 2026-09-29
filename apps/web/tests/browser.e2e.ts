import { expect, test, type Page } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
const hasTestAccount = Boolean(email && password);

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/my$/);
}

test("converts a Bikram Sambat date in the browser", async ({ page }) => {
  await page.goto("/bs-to-ad");
  await page.getByLabel("Nepali year").fill("2083");
  await page.getByLabel("Nepali month").selectOption("6");
  await page.getByLabel("Day", { exact: true }).fill("11");
  await page.getByRole("button", { name: "Convert date" }).click();
  await expect(page.getByText("Converted date")).toBeVisible();
  await expect(page.locator(".result-main")).toContainText(
    "September 27, 2026",
  );
});

test("opens the main navigation on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menuTrigger = page.locator(".mobile-menu summary");
  await expect(menuTrigger).toBeVisible();
  await menuTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
});

test("serves an installable app manifest and worker", async ({ request }) => {
  const manifestResponse = await request.get("/manifest.webmanifest");
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest.name).toContain("MeroDin");
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons).toContainEqual(
    expect.objectContaining({ src: "/icon-192.png", sizes: "192x192" }),
  );
  expect(manifest.icons).toContainEqual(
    expect.objectContaining({
      src: "/icon-512.png",
      sizes: "512x512",
      purpose: "maskable",
    }),
  );

  const workerResponse = await request.get("/sw.js");
  expect(workerResponse.ok()).toBe(true);
  expect(workerResponse.headers()["cache-control"]).toContain("no-store");
});

test("makes a previously visited public page available offline", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.goto("/calendar");
  await expect(
    page.getByRole("heading", { name: "Nepali calendar", level: 1 }),
  ).toBeVisible();

  await page.context().setOffline(true);
  await page.goto("/calendar");
  await expect(
    page.getByRole("heading", { name: "Nepali calendar", level: 1 }),
  ).toBeVisible();
});

test("loads the email sign-in form", async ({ page }) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Welcome back", level: 1 }),
  ).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

test.describe("authenticated personal workflows", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !hasTestAccount,
      "Set E2E_EMAIL and E2E_PASSWORD for a dedicated Supabase test account.",
    );
    await signIn(page);
  });

  test("signs in and opens My Space", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "My Space", level: 1 }),
    ).toBeVisible();
  });

  test("creates and removes an expense", async ({ page }) => {
    const description = `E2E expense ${Date.now()}`;
    await page.goto("/my/expenses");
    await page.getByLabel("Amount (रु)").fill("321.45");
    await page.getByLabel("Description").fill(description);
    await page.getByRole("button", { name: "Add transaction" }).click();

    const expense = page
      .locator(".expense-row")
      .filter({ hasText: description });
    await expect(expense).toBeVisible();
    await expense.getByRole("button", { name: "Delete" }).click();
    await expect(expense).toHaveCount(0);
  });

  test("creates and removes a reminder", async ({ page }) => {
    const title = `E2E reminder ${Date.now()}`;
    await page.goto("/my/reminders");
    await page.getByLabel("Title", { exact: true }).fill(title);
    await page.getByLabel(/Date and time/).fill("2027-01-01T12:00");
    await page.getByLabel("Repeat").selectOption("monthly");
    await page.getByRole("button", { name: "Add reminder" }).click();

    const reminder = page.locator(".reminder-row").filter({ hasText: title });
    await expect(reminder).toBeVisible();
    await expect(reminder.getByText("Repeats monthly")).toBeVisible();
    await reminder.getByRole("button", { name: "Delete" }).click();
    await expect(reminder).toHaveCount(0);
  });

  test("creates and removes a note", async ({ page }) => {
    const title = `E2E note ${Date.now()}`;
    await page.goto("/my/notes");
    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Note").fill("Created by the end-to-end test.");
    await page.getByRole("button", { name: "Save note" }).click();

    const note = page.locator(".note-card").filter({ hasText: title });
    await expect(note).toBeVisible();
    await note.getByRole("button", { name: "Delete" }).click();
    await expect(note).toHaveCount(0);
  });
});
