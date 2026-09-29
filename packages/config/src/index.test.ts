import { describe, expect, test } from "bun:test";
import { siteConfig } from "./index";

describe("site configuration", () => {
  test("uses the MeroDin product name", () => {
    expect(siteConfig.name).toBe("MeroDin");
  });
});
