'use server'

import { db } from '@/db';
import { stripe } from '@/lib/stripe';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import type { Order } from '@prisma/client';

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
    include: {
      color: true,
      size: true,
      fabric: true,
      product: true,
    },
  });

  if (!configuration) {
    throw new Error('No such configuration found');
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error('You need to be logged in');
  }

  // Use the product price from the related product.
  // If a discount is available, use it; otherwise, fall back to the real price.
  let basePrice = 0;
  if (configuration.product) {
    basePrice = configuration.product.discountPrice || configuration.product.realPrice;
  }
  // Add any extra cost from the selected fabric (if any)
  let fabricExtra = configuration.fabric?.price ?? 0;
  let price = basePrice + fabricExtra;

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: user.id,
        configurationId: configuration.id,
      },
    });
  }

  const product = await stripe.products.create({
    name: 'Custom T-Shirt',
    images: [configuration.imageUrl || ''],
    default_price_data: {
      currency: 'INR',
      unit_amount: price,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ['card'],
    mode: 'payment',
    shipping_address_collection: { allowed_countries: ['IN', 'US'] },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
};
