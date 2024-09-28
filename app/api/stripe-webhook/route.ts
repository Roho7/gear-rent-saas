import { stripe } from "@/app/_utils/stripe";
import { supabaseAdminClient } from "@/app/_utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

async function updateBookingStatus(
  bookingId: string,
  listingId: string,
  status: string,
  stripeInvoiceId?: string,
) {
  const supabase = supabaseAdminClient();
  const updateData: any = { status };
  if (stripeInvoiceId) {
    updateData.stripe_invoice_id = stripeInvoiceId;
  }

  const { error } = await supabase
    .from("tbl_bookings")
    .update(updateData)
    .eq("booking_id", bookingId)
    .eq("listing_id", listingId);

  return { error };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature") as string;

    if (!signature) {
      return NextResponse.json({ message: "No signature found" }, {
        status: 400,
      });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return NextResponse.json(
        { message: "Webhook secret is not configured" },
        { status: 500 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return NextResponse.json({ message: error.message ?? "Webhook Error" }, {
        status: 400,
      });
    }

    let responseObject: any = {};

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, storeId, listingId, bookingId } = session.metadata ||
          {};

        if (!bookingId || !listingId) {
          throw new Error("Missing required metadata");
        }

        const { error } = await updateBookingStatus(
          bookingId,
          listingId,
          "payment_successful",
          session.id,
        );

        if (!error) {
          responseObject = {
            message: "success",
            bookingId,
            listingId,
            storeId,
            userId,
            stripeInvoiceId: session.id,
          };
          return NextResponse.json(responseObject, { status: 200 });
        } else {
          throw error;
        }
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, storeId, listingId, bookingId } = session.metadata ||
          {};

        if (!bookingId || !listingId) {
          throw new Error("Missing required metadata");
        }

        const { error } = await updateBookingStatus(
          bookingId,
          listingId,
          "payment_failed",
        );

        if (!error) {
          responseObject = {
            message: "payment_failed",
            bookingId,
            listingId,
            storeId,
            userId,
          };
          return NextResponse.json(responseObject, { status: 200 });
        } else {
          throw error;
        }
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { userId, storeId, listingId, bookingId } =
          paymentIntent.metadata || {};

        if (!bookingId || !listingId) {
          throw new Error("Missing required metadata");
        }

        const { error } = await updateBookingStatus(
          bookingId,
          listingId,
          "payment_failed",
        );

        if (!error) {
          responseObject = {
            message: "payment_failed",
            bookingId,
            listingId,
            storeId,
            userId,
            failureReason: paymentIntent.last_payment_error?.message,
          };
          return NextResponse.json(responseObject, { status: 200 });
        } else {
          throw error;
        }
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
        return NextResponse.json({ message: "Unhandled event type" }, {
          status: 200,
        });
    }
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
