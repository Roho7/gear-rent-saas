import { stripe } from "@/app/_utils/stripe";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

const DOMAIN = process.env.NEXT_PUBLIC_VERCEL_ENV === "local"
  ? "http://localhost:3000"
  : process.env.NEXT_PUBLIC_GEARYO_DOMAIN;

export async function POST(
  req: Request,
  res: NextApiResponse,
) {
  try {
    const { productId, listingId, price, storeId, quantity, bookingId } =
      await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Missing required field: productId" },
        { status: 400 },
      );
    }

    if (!listingId) {
      return NextResponse.json(
        { error: "Missing required field: listingId" },
        { status: 400 },
      );
    }

    if (!price) {
      return NextResponse.json(
        { error: "Missing required field: price" },
        { status: 400 },
      );
    }

    if (!storeId) {
      return NextResponse.json(
        { error: "Missing required field: storeId" },
        { status: 400 },
      );
    }

    if (!quantity) {
      return NextResponse.json(
        { error: "Missing required field: quantity" },
        { status: 400 },
      );
    }

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing required field: bookingId" },
        { status: 400 },
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "test",
            },
            unit_amount: price * 100, // Stripe expects the amount in cents
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url:
        `${DOMAIN}/checkout/status?booking_id=${bookingId}&payment_status=success`,
      cancel_url:
        `${DOMAIN}/checkout/status?booking_id=${bookingId}&payment_status=failure`,
      metadata: {
        productId,
        storeId,
        listingId,
        bookingId,
      },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 });
  }
}
