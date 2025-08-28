import { db, sales, subscriptions } from "@/db";
import { MONTH_IN_MS, PRODUCTS, YEAR_IN_MS } from "@/lib/constants";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function POST(req: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === "checkout.session.completed") {
    const charge = event.data.object as Stripe.Checkout.Session;
    const { userId, productId } = charge.metadata ?? {};
    if (!userId || !productId) {
      console.error("Missing metadata");
      return new NextResponse(null, { status: 400 });
    }

    // let code: string | undefined;
    const total = charge.amount_total ?? 0;

    // if (
    //   (charge.total_details?.amount_discount ?? 0) > 0 &&
    //   charge.discounts?.[0]
    // ) {
    //   const promoCodeId = charge.discounts[0].promotion_code;
    //   if (!promoCodeId) return new NextResponse(null, { status: 400 });
    //   const promoCode = await stripe.promotionCodes.retrieve(
    //     promoCodeId as string
    //   );
    //   code = promoCode.code;
    // }

    const stripeId = charge.subscription as string | undefined;

    switch (productId) {
      case PRODUCTS.monthly.id:
        if (!stripeId) return new NextResponse(null, { status: 400 });
        await handleMonthlyPayment(userId, stripeId, total);
        break;
      case PRODUCTS.yearly.id:
        if (!stripeId) return new NextResponse(null, { status: 400 });
        await handleYearlyPayment(userId, stripeId, total);
        break;
    }
  } else if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;

    // const promoCodeId = invoice.discount?.promotion_code;
    // const promoCode = await stripe.promotionCodes.retrieve(
    //   promoCodeId as string
    // );
    // const code = promoCode.code;

    const subscriptionId = invoice.subscription as string | undefined;
    if (!subscriptionId) return new NextResponse(null, { status: 400 });
    const result = await handleSubscriptionRenewal(
      subscriptionId,
      invoice.total
    );
    if (result === "error") {
      return new NextResponse(null, { status: 400 });
    }
  } else {
    console.error(`Unhandled event type: ${event.type}`);
    return new NextResponse(null, { status: 400 });
  }

  return new NextResponse(null, { status: 200 });
}

async function handleMonthlyPayment(
  userId: string,
  stripeId: string,
  total: number
) {
  const [existing] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));

  const existingExpiresAt = existing?.expiresAt.getTime() ?? 0;
  const startDate =
    existingExpiresAt > Date.now() ? existingExpiresAt : Date.now();
  const newExpiresAt = new Date(startDate + MONTH_IN_MS);

  await Promise.all([
    db.insert(sales).values({
      userId,
      productId: PRODUCTS.monthly.id,
      pricePaidInPennies: total,
    }),
    db.insert(subscriptions).values({
      userId,
      stripeId,
      type: "monthly",
      expiresAt: newExpiresAt,
      isRenewing: true,
    }),
  ]);
}

async function handleYearlyPayment(
  userId: string,
  stripeId: string,
  total: number
) {
  const [existing] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));

  const existingExpiresAt = existing?.expiresAt.getTime() ?? 0;
  const startDate =
    existingExpiresAt > Date.now() ? existingExpiresAt : Date.now();
  const newExpiresAt = new Date(startDate + YEAR_IN_MS);

  await Promise.all([
    db.insert(sales).values({
      userId,
      productId: PRODUCTS.yearly.id,
      pricePaidInPennies: total,
    }),
    db.insert(subscriptions).values({
      userId,
      stripeId,
      type: "yearly",
      expiresAt: newExpiresAt,
      isRenewing: true,
    }),
  ]);
}

async function handleSubscriptionRenewal(stripeId: string, discount: number) {
  const [existing] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeId, stripeId));

  if (!existing) return "error";

  if (existing.type === "monthly") {
    db.update(subscriptions).set({
      isRenewing: true,
      expiresAt: new Date(Date.now() + MONTH_IN_MS),
    });
  } else if (existing.type === "yearly") {
    db.update(subscriptions).set({
      isRenewing: true,
      expiresAt: new Date(Date.now() + YEAR_IN_MS),
    });
  }

  await db.insert(sales).values({
    userId: existing.userId,
    productId:
      existing.type === "monthly" ? PRODUCTS.monthly.id : PRODUCTS.yearly.id,
    pricePaidInPennies:
      (existing.type === "monthly"
        ? PRODUCTS.monthly.priceInPennies
        : PRODUCTS.yearly.priceInPennies) - discount,
  });

  return "success";
}
