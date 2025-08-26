import { db, users } from "@/db";
import { buildErrorResponse, buildSessionResponse } from "@/lib/api";
import { verifyPassword } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { session } = await req.json();
  if (!session) return buildErrorResponse("missingData");
  const { email, password } = session;
  if (!email || !password) return buildErrorResponse("missingData");

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return buildErrorResponse("invalidCredentials");

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) return buildErrorResponse("invalidCredentials");

  return buildSessionResponse({ ...user, userId: user.id });
}
