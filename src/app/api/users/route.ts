import { db, users } from "@/db";
import { buildAPIResponse, buildErrorResponse, tryBlock } from "@/lib/api";
import { like } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return await tryBlock(async () => {
    const params = req.nextUrl.searchParams;
    const username = params.get("username");

    if (!username) return buildErrorResponse("missingData");

    const foundUsers = await db
      .select({
        id: users.id,
        username: users.username,
        color: users.color,
      })
      .from(users)
      .where(like(users.username, `%${username}%`));

    return buildAPIResponse(foundUsers);
  });
}
