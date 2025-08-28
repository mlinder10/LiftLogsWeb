import { buildErrorResponse, tryBlock } from "@/lib/api";
import { NextRequest } from "next/server";
import z from "zod";

const SubscribePostBodySchema = z.object({
  userId: z.string(),
});

export async function POST(req: NextRequest) {
  return await tryBlock(async () => {
    const body = await req.json();

    const parsed = SubscribePostBodySchema.safeParse(body);
    if (!parsed.success) {
      parsed.error.issues.map((issue) => console.error(issue.message));
      return buildErrorResponse("missingData");
    }

    return buildErrorResponse("unknown");
  });
}
