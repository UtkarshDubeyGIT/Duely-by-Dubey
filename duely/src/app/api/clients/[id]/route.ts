import { NextResponse } from "next/server";
import { getClients } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { createClientSchema } from "@/lib/validations";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = (await getClients()).find((item) => item.id === id);
  return client
    ? NextResponse.json({ data: client, error: null })
    : NextResponse.json({ data: null, error: "Client not found" }, { status: 404 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  
  const parsed = createClientSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ data: null, error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase.from("clients").update(parsed.data).eq("id", id).select("*").single();
  
  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, error: null });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  if (!supabase) {
    return NextResponse.json({ data: null, error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase.from("clients").delete().eq("id", id).select();
  
  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ data: null, error: "Client not found or unauthorized" }, { status: 404 });
  }

  return NextResponse.json({ data: { id }, error: null });
}
