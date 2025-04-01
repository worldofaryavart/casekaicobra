"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order, PaymentMethod, PaymentStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

// Helper function to get configuration and calculate price
const getConfigurationAndPrice = async (configId: string) => {
  // Include the fabric relation to access its value
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
    include: { fabric: true },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  const fabric = configuration.fabric;
  let price = BASE_PRICE;
  
  // Compare using the fabric's value (ensuring it’s lowercase for consistency)
  if (fabric?.value.toLowerCase() === "cotton") price += PRODUCT_PRICES.fabric.cotton;
  else if (fabric?.value.toLowerCase() === "polyester") price += PRODUCT_PRICES.fabric.polyester;
  else if (fabric?.value.toLowerCase() === "polycotton") price += PRODUCT_PRICES.fabric.polycotton;
  else if (fabric?.value.toLowerCase() === "dotknit") price += PRODUCT_PRICES.fabric.dotKnit;

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
      paymentStatus: (paymentMethod === "cod" ? "pending" : "initiated") as PaymentStatus,
    },
  });
};

// 4. Cash on Delivery
export const createCODOrder = async ({ configId }: { configId: string }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const { configuration, price } = await getConfigurationAndPrice(configId);

  // Create or get order with COD payment method
  const order = await getOrCreateOrder(user.id, configId, price, "cod");

  // For COD, we just need to create the order with the pending status
  await db.order.update({
    where: { id: order.id },
    data: {
      paymentIntentId: `cod_${uuidv4()}`,
      paymentStatus: "pending",
    },
  });

  return { orderId: order.id };
};
