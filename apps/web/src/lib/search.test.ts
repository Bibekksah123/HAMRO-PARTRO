import { describe, expect, it } from "bun:test";
import { searchSite } from "./search";

describe("site search", () => {
  it("finds calculators and named festivals", () => {
    expect(
      searchSite("EMI").some((result) => result.href === "/calculators/emi"),
    ).toBe(true);
    expect(
      searchSite("Dashain").some(
        (result) => result.href === "/festivals/dashain",
      ),
    ).toBe(true);
  });

  it("turns a valid BS date query into a calendar result", () => {
    const result = searchSite("2083-06-11").find(
      (item) => item.kind === "Calendar date",
    );
    expect(result?.href).toBe("/calendar/2083-06-11");
    expect(
      searchSite("2083-99-99").some((item) => item.kind === "Calendar date"),
    ).toBe(false);
  });
});
