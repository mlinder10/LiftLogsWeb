import { APIError, Session, SessionResponse } from "@/types";
import { NextResponse } from "next/server";

export function buildErrorResponse(error: APIError) {
  return new NextResponse(JSON.stringify({ error }));
}

export function buildSessionResponse(session: Session) {
  return new NextResponse(
    JSON.stringify({
      session: {
        userId: session.userId,
        email: session.email,
        username: session.username,
        color: session.color,
        createdAt: session.createdAt.replace(/\.\d{3}Z$/, "Z"),
        subscription: session.subscription,
      },
    } satisfies SessionResponse)
  );
}
