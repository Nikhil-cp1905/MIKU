// src/app/api/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { srm_email, score, timeTaken, answers } = await req.json();

    if (!srm_email || score == null || timeTaken == null || !answers) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Update participant by srm_email
    const { data, error } = await supabaseServer
      .from("participants")
      .update({ score, time_taken: timeTaken, answers })
      .eq("srm_email", srm_email)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

