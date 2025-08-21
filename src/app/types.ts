type User = {
  id: string; // unique
  email: string; // unique
  username: string; // unique
  password: string;
  createdAt: Date;
  color: string;
};

//

type Split = {};

type Workout = {};

//

type CompletedWorkout = {};

//

type ListExercise = {};

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
