import { db, users } from "@/db";
import { buildErrorResponse, buildSessionResponse } from "@/lib/api";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { session } = await req.json();
  if (!session) return buildErrorResponse("missingData");
  const { email, userId, username } = session;
  if (!email) return buildErrorResponse("missingData");

  const [user] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.email, email),
        eq(users.id, userId),
        eq(users.username, username)
      )
    );
  if (!user) return buildErrorResponse("invalidCredentials");

  return buildSessionResponse({
    ...user,
    userId: user.id,
    createdAt: user.createdAt.toISOString(),
  });
}
