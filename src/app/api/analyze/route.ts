import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { analyzeRisk } from "@/lib/risk-engine";
import type { WizardData } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: dbUser } = await supabase
      .from("users")
      .select("scan_credits")
      .eq("id", user.id)
      .single();

    if (!dbUser || dbUser.scan_credits <= 0) {
      return NextResponse.json(
        { error: "No scan credits remaining. Please purchase more credits." },
        { status: 402 }
      );
    }

    const {
      wizardData,
      ocrDetectedWords,
      descriptionFlags,
    }: {
      wizardData: WizardData;
      ocrDetectedWords: string[];
      descriptionFlags: string[];
    } = await request.json();

    const results = analyzeRisk(wizardData, ocrDetectedWords, descriptionFlags);

    const { data: report, error: insertError } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        app_name: wizardData.appName,
        approval_score: results.approvalProbability,
        approval_category: results.approvalCategory,
        results_json: results,
      })
      .select("id")
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to save report" },
        { status: 500 }
      );
    }

    await supabase
      .from("users")
      .update({ scan_credits: dbUser.scan_credits - 1 })
      .eq("id", user.id);

    return NextResponse.json({ reportId: report.id, results });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
