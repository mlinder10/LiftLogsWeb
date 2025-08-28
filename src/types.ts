import { InferSelectModel } from "drizzle-orm";
import { users } from "./db";

export type User = InferSelectModel<typeof users>;

export type SharedObject = "split" | "workout" | "workoutLog";

// Endpoints

export type SessionResponse = APIResponse<Session>;

export type APIResponse<T> = {
  data?: T;
  error?: APIError;
};

export type Session = {
  userId: string;
  email: string;
  username: string;
  color: string;
  createdAt: string;
  subscription: Subscription;
};

export type Subscription = "unsubscribed" | "trial" | "monthly" | "yearly";

export type APIError =
  | "invalidCredentials"
  | "emailInUse"
  | "usernameInUse"
  | "unknown"
  | "missingData"
  | "invalidData"
  | "unauthorized"
  | "dbError"
  | "notFound";
