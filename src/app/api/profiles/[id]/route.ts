import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE — remove a business profile (and all its scoped data)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Profile id required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Guard: refuse to delete if it's the only profile
    const { count } = await supabase
      .from("business_config")
      .select("id", { count: "exact", head: true });

    if ((count ?? 0) <= 1) {
      return NextResponse.json(
        { success: false, error: "Cannot delete the only business profile" },
        { status: 400 }
      );
    }

    // Delete profile (FK cascades will clean up scoped data if ON DELETE CASCADE is set,
    // otherwise null them out gracefully)
    const { error } = await supabase.from("business_config").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting profile:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
