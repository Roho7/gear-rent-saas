import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const DOMAIN = "http://localhost:3000";

export async function POST(
  req: Request,
  res: NextApiResponse,
) {
  try {
    const { productId, listingId, price, storeId, quantity } = await req.json();

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
      success_url: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/cancel`,
      metadata: {
        productId,
        storeId,
        listingId,
      },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 });
  }
}
