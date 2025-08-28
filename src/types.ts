import { InferSelectModel } from "drizzle-orm";
import { users } from "./db";

export type User = InferSelectModel<typeof users>;

//

type Split = {
  id: string;
};

type Workout = {
  id: string;
};

//

type CompletedWorkout = {
  id: string;
};

//

type ListExercise = {
  id: string;
};

//

// DB Record
type SharedItemRow = {
  id: string;
  ownerId: string;
  sharedWith: string[];
  claimedBy: string[];
  sharedAt: Date;
  splitId: string | null;
  workoutId: string | null;
  completedWorkoutId: string | null;
  listExerciseId: string | null;
};

type SharedItem = {
  ownerUsername: string;
  sharedAt: Date;
  split: Split | null;
  workout: Workout | null;
  completedWorkout: CompletedWorkout | null;
  listExercise: ListExercise | null;
  listExercises: ListExercise[];
};

// Endpoints

export type SessionResponse = {
  session?: Session;
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
  | "missingData";

function GET_usersByUsernames(usernames: string[]): User[] {
  return [];
}

function GET_sharedItems(itemId: string): SharedItem[] {
  // add to claimedBy
  return [];
}

function POST_sharedItem(
  ownerId: string,
  userIds: string[],
  split: Split | null,
  workout: Workout | null,
  completedWorkout: CompletedWorkout | null,
  listExercise: ListExercise | null
) {}

function GET_mySharedItems(userId: string): SharedItem[] {
  return [];
}
