"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order, PaymentMethod, PaymentStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

// Helper function to get configuration and calculate price
const getConfigurationAndPrice = async (configId: string) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  const { fabric } = configuration;

  let price = BASE_PRICE;
  if (fabric === "cotton") price += PRODUCT_PRICES.fabric.cotton;
  else if (fabric === "polyester") price += PRODUCT_PRICES.fabric.polyester;
  else if (fabric === "polycotton") price += PRODUCT_PRICES.fabric.polycotton;
  else if (fabric === "dotKnit") price += PRODUCT_PRICES.fabric.dotKnit;

  return { configuration, price };
};

// Helper function to get or create an order
const getOrCreateOrder = async (
  userId: string,
  configId: string,
  price: number,
  paymentMethod: string
) => {
  const existingOrder = await db.order.findFirst({
    where: {
      userId,
      configurationId: configId,
    },
  });

  if (existingOrder) {
    return existingOrder;
  }

  return await db.order.create({
    data: {
      amount: price / 100,
      userId,
      configurationId: configId,
      paymentMethod: paymentMethod as PaymentMethod,
      paymentStatus: (paymentMethod === "cod"
        ? "pending"
        : "initiated") as PaymentStatus,
    },
  });
};

// 1. Stripe Payment
export const createStripeCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const { configuration, price } = await getConfigurationAndPrice(configId);

  const order = await getOrCreateOrder(user.id, configId, price, "stripe");

  const product = await stripe.products.create({
    name: "Custom T-Shirt",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "INR",
      unit_amount: price,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout?configId=${configuration.id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["IN", "US"] },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  // Update order with session ID
  await db.order.update({
    where: { id: order.id },
    data: {
      paymentIntentId: stripeSession.id,
      paymentStatus: "initiated",
    },
  });

  return { url: stripeSession.url };
};


// // 3. UPI Payment
// export const createUPICheckoutSession = async ({
//   configId,
// }: {
//   configId: string
// }) => {
//   const { getUser } = getKindeServerSession()
//   const user = await getUser()

//   if (!user) {
//     throw new Error('You need to be logged in')
//   }

//   const { configuration, price } = await getConfigurationAndPrice(configId)

//   // Create or get order
//   const order = await getOrCreateOrder(user.id, configId, price, 'upi')

//   // In a real implementation, you would:
//   // 1. Generate a UPI payment link/QR code using a payment gateway that supports UPI
//   // 2. Save the reference ID to your database
//   // 3. Return the URL to the UPI payment page

//   const mockUpiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upi/checkout?orderId=${order.id}&configId=${configId}`

//   // Update order with payment initiated status
//   await db.order.update({
//     where: { id: order.id },
//     data: {
//       paymentIntentId: `upi_${uuidv4()}`,
//       paymentStatus: 'initiated'
//     },
//   })

//   return { url: mockUpiUrl }
// }

// // 4. Cash on Delivery
export const createCODOrder = async ({
  configId,
}: {
  configId: string
}) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    throw new Error('You need to be logged in')
  }

  const { configuration, price } = await getConfigurationAndPrice(configId)

  // Create or get order with COD payment method
  const order = await getOrCreateOrder(user.id, configId, price, 'cod')

  // For COD, we just need to create the order with the pending status
  await db.order.update({
    where: { id: order.id },
    data: {
      paymentIntentId: `cod_${uuidv4()}`,
      paymentStatus: 'pending'
    },
  })

  return { orderId: order.id }
}
