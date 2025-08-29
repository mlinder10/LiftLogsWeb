"use server";

import { db, subscriptions } from "@/db";
import { Product } from "@/lib/constants";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function createCheckoutSession(product: Product, userId: string) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.priceInPennies,
          recurring: product.isSubscription
            ? { interval: product.subscriptionInterval }
            : undefined,
        },
        quantity: 1,
      },
    ],
    mode: product.isSubscription ? "subscription" : "payment",
    allow_promotion_codes: true,
    success_url: `${process.env.SERVER_URL!}/pricing`,
    cancel_url: `${process.env.SERVER_URL!}/pricing`,
    payment_method_types: ["card"],
    metadata: {
      productId: product.id,
      userId,
    },
  });

  return session.url;
}

export async function cancelSubscription(stripeId: string) {
  try {
    await stripe.subscriptions.update(stripeId, {
      cancel_at_period_end: true,
    });
    await db
      .update(subscriptions)
      .set({
        isRenewing: false,
      })
      .where(eq(subscriptions.stripeId, stripeId));
  } catch (error) {
    console.error(error);
  }
}
