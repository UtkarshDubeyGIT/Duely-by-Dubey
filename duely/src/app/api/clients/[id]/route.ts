import { NextResponse } from "next/server";
import { getClients } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ data: { id, ...body }, error: null });
  }
  const { data, error } = await supabase.from("clients").update(body).eq("id", id).select("*").single();
  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data, error: null });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ data: { id }, error: null });
  }
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: { id }, error: null });
}
