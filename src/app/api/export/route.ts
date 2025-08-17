import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const adminPassword = url.searchParams.get("adminPassword");

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabaseServer
      .from("participants")
      .select("name,email,ra_number,phone,score,time_taken,submitted_at")
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    // If you want CSV later, we can add a `format=csv` switch here.
    return NextResponse.json({ participants: data });
  } catch (err: any) {
    console.error("admin export:", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}

