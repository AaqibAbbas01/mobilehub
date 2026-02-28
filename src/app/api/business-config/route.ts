import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTemplateByType } from "@/lib/business-templates";
import { getProfileId } from "@/lib/profile";

// GET - Retrieve the active profile's business config
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const profileId = getProfileId(request);

    let query = supabase.from("business_config").select("*");
    if (profileId) {
      query = query.eq("id", profileId);
    }

    const { data, error } = await query.limit(1).maybeSingle();

    if (error && error.code !== "PGRST116") throw error;

    if (!data) {
      const template = getTemplateByType("mobile_phones");
      return NextResponse.json({ success: true, config: template, is_default: true });
    }

    return NextResponse.json({ success: true, config: data, is_default: false });
  } catch (error) {
    console.error("Error fetching business config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch business config" },
      { status: 500 }
    );
  }
}

// Fields from BusinessTemplate that exist ONLY in-memory (not DB columns).
// Strip them before any INSERT / UPDATE so Supabase doesn't reject unknown columns.
const TEMPLATE_ONLY_FIELDS = ["name", "description", "icon", "color"] as const;

function sanitizeForDB(config: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, created_at, updated_at, ...rest } = config as Record<string, unknown>;
  void id; // intentionally dropped — DB manages UUID
  void created_at;
  void updated_at;
  for (const field of TEMPLATE_ONLY_FIELDS) {
    delete (rest as Record<string, unknown>)[field];
  }
  return rest;
}

// POST - Save / update business config
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const raw = await request.json();
    const payload = sanitizeForDB(raw);

    // Check if a row already exists
    const { data: existing, error: fetchErr } = await supabase
      .from("business_config")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (fetchErr) throw fetchErr;

    let result;
    if (existing) {
      result = await supabase
        .from("business_config")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("business_config")
        .insert({ ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json({ success: true, config: result.data });
  } catch (error) {
    console.error("Error saving business config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save business config" },
      { status: 500 }
    );
  }
}
