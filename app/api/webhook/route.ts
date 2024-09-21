import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret,
      );
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Handle the successful payment
      await handleSuccessfulPayment(session);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { productId, storeId } = session.metadata!;
  const amount = session.amount_total!;

  // Calculate platform fee (10%)
  const platformFee = Math.round(amount * 0.1);
  const storeAmount = amount - platformFee;

  // TODO: Update your database to record the successful payment, including the platform fee

  // Create a transfer to the store
  await stripe.transfers.create({
    amount: storeAmount,
    currency: "usd",
    destination: storeId, // Assuming storeId is the Stripe account ID of the store
    transfer_group: session.id,
  });

  // Create an invoice for the store
  await createInvoiceForStore(storeId, amount, platformFee, productId);
}

async function createInvoiceForStore(
  storeId: string,
  amount: number,
  platformFee: number,
  productId: string,
) {
  // TODO: Implement invoice creation logic
  // This could involve creating an invoice in your own system or using Stripe Invoices
  console.log(`Creating invoice for store ${storeId} for product ${productId}`);
  console.log(`Total amount: ${amount}, Platform fee: ${platformFee}`);
}
