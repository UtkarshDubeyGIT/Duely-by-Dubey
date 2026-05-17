import { NextResponse } from "next/server";
import { getClients } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { createClientSchema } from "@/lib/validations";

export async function GET() {
  return NextResponse.json({ data: await getClients(), error: null });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message ?? "Invalid client" }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ data: null, error: "Database not configured" }, { status: 503 });
  }

  const { data: profile } = await supabase.from("profiles").select("org_id").single();
  const { data, error } = await supabase.from("clients").insert({ ...parsed.data, org_id: profile?.org_id, reliability_tag: "new", avg_days_late: 0 }).select("*").single();
  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}
