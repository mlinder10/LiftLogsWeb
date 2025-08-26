import { sql } from "drizzle-orm";
import { customType, index, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Extensions ---------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const float32Array = customType<{
  data: number[];
  config: { dimensions: number };
  configRequired: true;
  driverData: Buffer;
}>({
  dataType(config) {
    return `F32_BLOB(${config.dimensions})`;
  },
  fromDriver(value: Buffer) {
    return Array.from(new Float32Array(value.buffer));
  },
  toDriver(value: number[]) {
    return sql`vector32(${JSON.stringify(value)})`;
  },
});

function jsonType<T>() {
  return customType<{
    data: T;
    configRequired: false;
    driverData: Buffer;
  }>({
    dataType() {
      return `TEXT`;
    },
    fromDriver(value: Buffer) {
      return JSON.parse(value.toString("utf-8"));
    },
    toDriver(value: T) {
      return sql`${JSON.stringify(value)}`;
    },
  });
}

function json<T>(name: string) {
  return jsonType<T>()(name);
}

const date = customType<{
  data: Date;
  driverData: string;
  configRequired: false;
}>({
  dataType() {
    return "TEXT";
  },
  fromDriver(value: string) {
    return new Date(value);
  },
  toDriver(value: Date) {
    return value.toISOString();
  },
});

const SQL_UUID = sql`(lower(hex(randomblob(16))))`;
const SQL_NOW = sql`(datetime('now'))`;

// Schemas ------------------------------------------------------------------

export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  color: text("color").notNull(),
  password: text("password").notNull(),
  createdAt: date("created_at").default(SQL_NOW),
});
