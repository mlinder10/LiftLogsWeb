"use server";

import { SessionResponse } from "@/types";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!);

// Base token methods ---------------------------------------------------------------

export async function signToken(payload: SessionResponse) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    // .setExpirationTime("1d")
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return payload as SessionResponse;
  } catch {
    return null;
  }
}

//

export async function attachToken(token: string) {
  (await cookies()).set(process.env.JWT_KEY!, token, {
    path: "/",
    expires: undefined,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
}

export async function logout() {
  (await cookies()).set(process.env.JWT_KEY!, "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
}

// Password hashing ---------------------------------------------------------------

export async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );
  return Buffer.from(arrayBuffer).toString("hex");
}

export async function verifyPassword(password: string, hash: string) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Token access ---------------------------------------------------------------

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.JWt_KEY!);
  return token ? await verifyToken(token.value) : null;

  // const head = await headers();
  // const jwt = head
  //   .get("cookie")
  //   ?.split("; ")
  //   .filter((v) => v.startsWith(process.env.JWT_KEY!));
  // if (jwt === undefined || jwt.length === 0) {
  //   return null;
  // }
  // const token = jwt[0].split("=")[1];
  // if (token) {
  //   const decoded = await verifyToken(token);
  //   return decoded;
  // }
  // return null;
}
