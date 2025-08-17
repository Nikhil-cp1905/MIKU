import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, srm_email, ra_number, phone_number } = body;

    if (!name || !srm_email || !ra_number || !phone_number) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("participants")
      .insert([{ name, srm_email, ra_number, phone_number }]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

