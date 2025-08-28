import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

const HEX_CHARS = "0123456789ABCDEF";

export function randomHexColor() {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += HEX_CHARS[Math.floor(Math.random() * 16)];
  }
  return color;
}
