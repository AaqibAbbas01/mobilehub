import { NextRequest } from "next/server";

/**
 * Reads the active profile ID from the request.
 *
 * Priority order:
 *  1. `active_profile_id` httpOnly cookie (set by /api/profiles/switch)
 *  2. `x-profile-id` header (fallback for programmatic callers)
 *  3. `profile_id` query param
 *
 * Returns null when no profile is scoped (super-admin browsing all data).
 */
export function getProfileId(request: NextRequest): string | null {
  return (
    request.cookies.get("active_profile_id")?.value ??
    request.headers.get("x-profile-id") ??
    request.nextUrl.searchParams.get("profile_id") ??
    null
  );
}
