import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { srm_email } = await req.json();

    if (!srm_email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("participants")
      .select("srm_email")
      .eq("srm_email", srm_email)
      .single();

    if (error && error.code !== "PGRST116") throw error; // ignore "no rows found"

    if (data) {
      return NextResponse.json({ valid: false, message: "Email already registered" });
    }

    return NextResponse.json({ valid: true });
  } catch (err: any) {
    console.error("validate-email error:", err);
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}

