import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const PROMO_CODES: Record<string, number> = {
  "3720613": 1,
  "2943186": 10,
};

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code || !PROMO_CODES[code]) {
      return NextResponse.json(
        { error: "Code invalid." },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from("users")
      .select("scan_credits")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Code invalid." },
        { status: 400 }
      );
    }

    // Check if code was already redeemed using a separate query
    // (redeemed_codes column may not exist yet)
    let redeemedCodes: string[] = [];
    try {
      const { data: codesData } = await supabase
        .from("users")
        .select("redeemed_codes")
        .eq("id", user.id)
        .single();
      if (codesData?.redeemed_codes) {
        redeemedCodes = codesData.redeemed_codes;
      }
    } catch {
      // Column doesn't exist yet, treat as empty
    }

    if (redeemedCodes.includes(code)) {
      return NextResponse.json(
        { error: "You have already redeemed this code." },
        { status: 400 }
      );
    }

    const creditsToAdd = PROMO_CODES[code];

    // Try to update with redeemed_codes, fall back to just credits
    const { error: updateError } = await supabase
      .from("users")
      .update({
        scan_credits: profile.scan_credits + creditsToAdd,
        redeemed_codes: [...redeemedCodes, code],
      })
      .eq("id", user.id);

    if (updateError) {
      // Column might not exist — update just credits
      await supabase
        .from("users")
        .update({ scan_credits: profile.scan_credits + creditsToAdd })
        .eq("id", user.id);
    }

    return NextResponse.json({
      credits: creditsToAdd,
      total: profile.scan_credits + creditsToAdd,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
