import { APIError, APIResponse, Session } from "@/types";
import { NextResponse } from "next/server";

export function buildErrorResponse(error: APIError): APIResponse<never> {
  return { error };
}

export function buildAPIResponse<T>(data: T): APIResponse<T> {
  return { data };
}

export function buildSessionResponse(session: Session): APIResponse<Session> {
  return {
    data: {
      userId: session.userId,
      email: session.email,
      username: session.username,
      color: session.color,
      createdAt: session.createdAt.replace(/\.\d{3}Z$/, "Z"),
      subscription: session.subscription,
    },
  };
}

export async function tryBlock<T>(
  fn: () => Promise<APIResponse<T>>
): Promise<NextResponse> {
  try {
    const result = await fn();
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    const error = buildErrorResponse("unknown");
    return NextResponse.json(error);
  }
}
