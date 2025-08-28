import { db, users } from "@/db";
import { buildErrorResponse, buildSessionResponse } from "@/lib/api";
import { hashPassword, randomHexColor } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email, username, password } = await req.json();
  if (!email || !username || !password)
    return buildErrorResponse("missingData");

  const hashedPassword = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({
      email,
      username,
      password: hashedPassword,
      color: randomHexColor(),
      subscription: "unsubscribed",
    })
    .returning();

  if (!user) return buildErrorResponse("invalidCredentials");

  return buildSessionResponse({
    ...user,
    userId: user.id,
    createdAt: user.createdAt.toISOString(),
  });
}
