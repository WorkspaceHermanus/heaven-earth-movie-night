import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const availability = await getAvailability();
    return NextResponse.json(availability, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[availability] failed", error);
    return NextResponse.json(
      { error: "Unable to load availability." },
      { status: 500 },
    );
  }
}
