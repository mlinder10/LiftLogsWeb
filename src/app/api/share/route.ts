import { db, sharedObjects } from "@/db";
import { eq } from "drizzle-orm";
import { buildAPIResponse, buildErrorResponse, tryBlock } from "@/lib/api";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  return await tryBlock(async () => {
    const params = req.nextUrl.searchParams;
    const objectId = params.get("objectId");
    const userId = params.get("userId");
    if (!objectId || !userId) return buildErrorResponse("missingData");

    const [object] = await db
      .select()
      .from(sharedObjects)
      .where(eq(sharedObjects.id, objectId));

    if (!object) return buildErrorResponse("notFound");

    if (object.ownerId !== userId && !object.sharedWith.includes(userId)) {
      return buildErrorResponse("unauthorized");
    }

    return buildAPIResponse(object);
  });
}

const SharePostBodySchema = z.object({
  ownerId: z.string(),
  sharedWith: z.array(z.string()),
  object: z.string(),
  listExercises: z.string(),
  type: z.enum(["split", "workout", "workoutLog"]),
});

export async function POST(req: NextRequest) {
  return await tryBlock(async () => {
    const body = await req.json();

    const parsed = SharePostBodySchema.safeParse(body);
    if (!parsed.success) {
      parsed.error.issues.map((issue) => console.error(issue.message));
      return buildErrorResponse("missingData");
    }

    // TODO: validate user is subscribed

    const [object] = await db
      .insert(sharedObjects)
      .values(parsed.data)
      .returning();

    if (!object) return buildErrorResponse("dbError");

    return buildAPIResponse({ objectId: object.id, objectType: object.type });
  });
}
