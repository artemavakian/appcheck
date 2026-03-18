import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const PROMO_CODES: Record<string, number> = {
  "3720613": 1,
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
        { error: "Invalid code." },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from("users")
      .select("scan_credits, redeemed_codes")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const redeemedCodes: string[] = profile.redeemed_codes ?? [];

    if (redeemedCodes.includes(code)) {
      return NextResponse.json(
        { error: "You have already redeemed this code." },
        { status: 400 }
      );
    }

    const creditsToAdd = PROMO_CODES[code];

    await supabase
      .from("users")
      .update({
        scan_credits: profile.scan_credits + creditsToAdd,
        redeemed_codes: [...redeemedCodes, code],
      })
      .eq("id", user.id);

    return NextResponse.json({
      credits: creditsToAdd,
      total: profile.scan_credits + creditsToAdd,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
