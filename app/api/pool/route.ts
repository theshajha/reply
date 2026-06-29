import { NextResponse } from "next/server";
import { readPool } from "@/lib/pool";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(readPool());
}
