import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("quiz_status")
      .select("is_active")
      .eq("id", 1)
      .single();

    if (error) throw error;
    return NextResponse.json({ isActive: data?.is_active ?? false });
  } catch (err: any) {
    console.error("quiz status GET:", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { adminPassword, isActive } = await req.json();

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabaseServer
      .from("quiz_status")
      .upsert({ id: 1, is_active: !!isActive, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, status: data });
  } catch (err: any) {
    console.error("quiz status POST:", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}

