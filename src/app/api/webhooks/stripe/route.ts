import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing stripe-signature header or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const credits = parseInt(session.metadata?.credits ?? "0", 10);

    if (!userId || !credits) {
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: user } = await supabase
      .from("users")
      .select("scan_credits")
      .eq("id", userId)
      .single();

    if (user) {
      await supabase
        .from("users")
        .update({ scan_credits: user.scan_credits + credits })
        .eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
