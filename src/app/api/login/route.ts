import { db, users } from "@/db";
import { buildErrorResponse, buildSessionResponse } from "@/lib/api";
import { verifyPassword } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { identifier, password } = await req.json();
  if (!identifier || !password) return buildErrorResponse("missingData");

  const user = await fetchUserByIdentifier(identifier);
  if (!user) return buildErrorResponse("invalidCredentials");

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) return buildErrorResponse("invalidCredentials");

  return buildSessionResponse({ ...user, userId: user.id });
}

async function fetchUserByIdentifier(identifier: string) {
  if (identifier.includes("@")) {
    // check email first
    const [userWithEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, identifier));
    if (userWithEmail) return userWithEmail;
    const [userWithUsername] = await db
      .select()
      .from(users)
      .where(eq(users.username, identifier));
    return userWithUsername;
  } else {
    // check username first
    const [userWithUsername] = await db
      .select()
      .from(users)
      .where(eq(users.username, identifier));
    if (userWithUsername) return userWithUsername;
    const [userWithEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, identifier));
    return userWithEmail;
  }
}
