"use server";

import { db } from "@/db";
import { createClient } from "@/utils/supabase/server";
import { Order, PaymentMethod, PaymentStatus } from "@prisma/client";

// Define the expected shipping address data type
type ShippingAddressData = {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
  phoneNumber?: string;
};

// Helper: Get configuration (with product and fabric) and calculate price.
const getConfigurationAndPrice = async (configId: string) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
    include: { fabric: true, product: true },
  });

  if (!configuration) {
    throw new Error("No configuration found");
  }

  let basePrice = 0;
  let totalPrice = 0;

  if (configuration.isCustom) {
    // For custom orders, use product discount price if available
    basePrice = configuration.product ? configuration.product.discountPrice : 0;
    totalPrice = basePrice;
  } else if (configuration.product) {
    // For shop orders, add fabric upgrade cost if available.
    basePrice = configuration.product.discountPrice;
    totalPrice = basePrice;
    if (configuration.fabric && configuration.fabric.price) {
      totalPrice += configuration.fabric.price;
    }
  }

  return { configuration, totalPrice };
};

// Helper: Check if an order already exists for this user/configuration.
// If not, create a new one.
const getOrCreateOrder = async (
  userId: string,
  configId: string,
  totalPrice: number,
  shippingAddressId: string,
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
      amount: totalPrice,
      userId,
      configurationId: configId,
      shippingAddressId,
      paymentMethod: paymentMethod as PaymentMethod,
      paymentStatus:
        paymentMethod === "cod"
          ? ("pending" as PaymentStatus)
          : ("initiated" as PaymentStatus),
    },
  });
};

// Main function to create a Cash on Delivery order.
export const createCODOrder = async ({
  configId,
  shippingAddress: shippingAddressData,
}: {
  configId: string;
  shippingAddress: ShippingAddressData;
}) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  console.log("user", user);

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const userId = user.id;

  // Fetch configuration and calculate the price.
  const { configuration, totalPrice } = await getConfigurationAndPrice(
    configId
  );

  // Save the shipping address provided by the user.
  const shippingAddress = await db.shippingAddress.create({
    data: {
      name: shippingAddressData.name,
      street: shippingAddressData.street,
      city: shippingAddressData.city,
      postalCode: shippingAddressData.postalCode,
      country: shippingAddressData.country,
      state: shippingAddressData.state,
      phoneNumber: shippingAddressData.phoneNumber,
    },
  });

  // Check if an order already exists for this configuration and user.
  // If not, create a new order.
  const order = await getOrCreateOrder(
    userId,
    configId,
    totalPrice,
    shippingAddress.id,
    "cod"
  );

  // Return the order id so the client can redirect to the thank-you page.
  return { orderId: order.id };
};
