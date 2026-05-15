import { NextResponse } from "next/server";
import { createInvoiceForCurrentOrg, getInvoices } from "@/lib/data";
import { createInvoiceSchema } from "@/lib/validations";

export async function GET() {
  return NextResponse.json({ data: await getInvoices(), error: null });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createInvoiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message ?? "Invalid invoice" }, { status: 400 });
    }

    const invoice = await createInvoiceForCurrentOrg(parsed.data);
    return NextResponse.json({ data: invoice, error: null }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ data: null, error: error instanceof Error ? error.message : "Invoice could not be created" }, { status: 500 });
  }
}
