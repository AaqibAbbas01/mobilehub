import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST — switch the active profile (sets an httpOnly cookie)
export async function POST(request: NextRequest) {
  try {
    const { profile_id } = await request.json();

    if (!profile_id) {
      return NextResponse.json({ error: "profile_id required" }, { status: 400 });
    }

    // Validate the profile exists
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("business_config")
      .select("id")
      .eq("id", profile_id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const response = NextResponse.json({ success: true, profile_id });

    response.cookies.set("active_profile_id", profile_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Error switching profile:", err);
    return NextResponse.json(
      { error: "Failed to switch profile" },
      { status: 500 }
    );
  }
}

// DELETE — clear the active_profile_id cookie (revert to default)
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("active_profile_id");
  return response;
}
