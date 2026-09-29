import { describe, expect, it } from "bun:test";
import { createDatabase } from "./index";

describe("database configuration", () => {
  it("requires a connection string before opening a client", () => {
    expect(() => createDatabase("")).toThrow(
      "DATABASE_URL is required to access the MeroDin database.",
    );
  });
});
