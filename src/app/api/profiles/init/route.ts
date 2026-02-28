import { createClient } from "@/lib/supabase/server";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Called immediately after login to initialise the active_profile_id cookie.
 * - Profile-specific admin → their own profile_id (from JWT)
 * - Super admin (profile_id = null) → the first business_config row
 */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    let profileId = session.user.profile_id;

    if (!profileId) {
      // Super admin — default to first profile
      const supabase = await createClient();
      const { data } = await supabase
        .from("business_config")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1)
        .single();
      profileId = data?.id ?? null;
    }

    if (!profileId) {
      return NextResponse.json({ success: true, note: "no profile found" });
    }

    const response = NextResponse.json({ success: true, profile_id: profileId });
    response.cookies.set("active_profile_id", profileId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch (err) {
    console.error("Profile init error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
