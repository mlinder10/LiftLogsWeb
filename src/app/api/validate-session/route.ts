import { db, subscriptions, users } from "@/db";
import { buildErrorResponse, buildSessionResponse, tryBlock } from "@/lib/api";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return await tryBlock(async () => {
    const { session } = await req.json();
    if (!session) return buildErrorResponse("missingData");
    const { email, userId, username } = session;
    if (!email) return buildErrorResponse("missingData");

    const [result] = await db
      .select()
      .from(users)
      .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
      .where(
        and(
          eq(users.email, email),
          eq(users.id, userId),
          eq(users.username, username)
        )
      );
    if (!result) return buildErrorResponse("invalidCredentials");
    const { users: user, subscriptions: subscription } = result;

    return buildSessionResponse({
      ...user,
      userId: user.id,
      createdAt: user.createdAt.toISOString(),
      subscription: subscription ? subscription.type : "unsubscribed",
    });
  });
}
