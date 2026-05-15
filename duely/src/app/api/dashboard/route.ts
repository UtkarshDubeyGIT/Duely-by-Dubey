import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ data: await getDashboardData(), error: null });
}
