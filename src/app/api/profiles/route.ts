import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET — list all business profiles (for profile switcher + settings)
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("business_config")
      .select(
        "id, business_type, display_name, product_name_singular, product_name_plural, order_prefix, setup_completed, created_at"
      )
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, profiles: data ?? [] });
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}

// POST — create a new business profile
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Strip template-only fields that aren't DB columns
    const { id, name, description, icon, color, created_at, updated_at, ...payload } = body;
    void id; void name; void description; void icon; void color; void created_at; void updated_at;

    const { data, error } = await supabase
      .from("business_config")
      .insert({
        ...payload,
        setup_completed: payload.setup_completed ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    console.error("Error creating profile:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
