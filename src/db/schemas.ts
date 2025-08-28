import { SharedObject, Subscription } from "@/types";
import { sql } from "drizzle-orm";
import {
  customType,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

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
  createdAt: date("created_at").notNull().default(SQL_NOW),
});

export const sharedObjects = sqliteTable("shared_objects", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  ownerId: text("owner").notNull(),
  sharedWith: json<string[]>("shared_with").notNull(),
  object: text("object").notNull(),
  listExercises: text("list_exercises").notNull(),
  type: json<SharedObject>("type").notNull(),
  createdAt: date("created_at").notNull().default(SQL_NOW),
});

export const sales = sqliteTable("sales", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  userId: text("user_id").notNull(),
  createdAt: date("created_at").notNull().default(SQL_NOW),
  productId: text("product_id").notNull(),
  pricePaidInPennies: integer("price_paid_in_pennies").notNull(),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  userId: text("user_id").notNull(),
  stripeId: text("stripe_id").notNull(),
  createdAt: date("created_at").notNull().default(SQL_NOW),
  type: json<Subscription>("type").notNull(),
  isRenewing: json<boolean>("is_renewing").notNull(),
  expiresAt: date("expires_at").notNull(),
});
