import { APIError, Session } from "@/types";
import { NextResponse } from "next/server";

export function buildErrorResponse(error: APIError) {
  return new NextResponse(JSON.stringify({ error }));
}

export function buildSessionResponse(session: Session) {
  return new NextResponse(JSON.stringify({ session }));
}
