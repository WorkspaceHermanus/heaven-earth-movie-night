import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { adminLoginSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** Slow brute force from a single address. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 5 * 60_000;
const MAX_ATTEMPTS = 10;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes." },
      { status: 429 },
    );
  }

  const parsed = adminLoginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    attempts.set(ip, {
      count: entry && entry.resetAt > now ? entry.count + 1 : 1,
      resetAt: entry && entry.resetAt > now ? entry.resetAt : now + WINDOW_MS,
    });
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), adminCookieOptions);
  return response;
}
