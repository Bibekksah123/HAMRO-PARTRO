import postgres, { type Sql } from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export * from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

type DbGlobals = typeof globalThis & { __merodinSql?: Sql };

export function createDatabase(url = process.env.DATABASE_URL): Database {
  if (!url) {
    throw new Error("DATABASE_URL is required to access the MeroDin database.");
  }
  const globals = globalThis as DbGlobals;
  const client =
    globals.__merodinSql ??
    postgres(url, {
      max: 1,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 10,
    });

  if (process.env.NODE_ENV !== "production") globals.__merodinSql = client;
  return drizzle(client, { schema });
}
