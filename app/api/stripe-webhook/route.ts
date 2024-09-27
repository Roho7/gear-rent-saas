import { stripe } from "@/app/_utils/stripe";
import { supabaseAdminClient } from "@/app/_utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature") as string;
    const supabase = supabaseAdminClient();

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return NextResponse.json({ message: error.message ?? "Webhook Error" }, {
        status: 400,
      });
    }

    let responseObject = {};

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session: Stripe.Checkout.Session = event.data.object;
      const userId = session.metadata?.userId;
      const storeId = session.metadata?.storeId;
      const listingId = session.metadata?.listingId;
      const bookingId = session.metadata?.bookingId;
      const stripeInvoiceId = session.id;

      // Create or update the stripe_customer_id in the stripe_customers table
      const { error } = await supabase
        .from("tbl_bookings")
        .update({
          status: "payment_successful",
          stripe_invoice_id: stripeInvoiceId,
        }).eq("booking_id", bookingId).eq("listing_id", listingId);

      if (!error) {
        responseObject = {
          message: "success",
          bookingId,
          listingId,
          storeId,
          userId,
          stripeInvoiceId,
        };
        return NextResponse.json(responseObject, { status: 200 });
      } else {
        responseObject = {
          message: "error",
          bookingId,
          listingId,
          storeId,
          userId,
          stripeInvoiceId,
          error,
        };
        return NextResponse.json(responseObject, { status: 500 });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
