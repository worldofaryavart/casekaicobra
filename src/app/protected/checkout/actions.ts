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

// Helper: Get or create a user in the Prisma database
const getOrCreateUser = async (supabaseUser: any) => {
  // First check if user exists in Prisma DB
  const existingUser = await db.user.findUnique({
    where: { id: supabaseUser.id },
  });

  if (existingUser) {
    return existingUser;
  }

  // Get the email from the user object
  const email = supabaseUser.email || "";

  // Create a new user if one doesn't exist
  return await db.user.create({
    data: {
      id: supabaseUser.id, // Use the Supabase user ID
      email: email,
    },
  });
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
  let deliveryCharge = 10;

  if (configuration.isCustom) {
    // For custom orders, use BASE_PRICE/100 (which appears to be from your config)
    // You might need to import BASE_PRICE or define it here
    basePrice = process.env.BASE_PRICE
      ? parseInt(process.env.BASE_PRICE)
      : 0;
    totalPrice = basePrice + deliveryCharge;
  } else if (configuration.product) {
    // For shop orders, use the product's discounted price
    basePrice = configuration.product.discountPrice;
    totalPrice = basePrice+ deliveryCharge;
  }

  // Add fabric price for both custom and shop orders if fabric is selected
  // if (configuration.fabric && configuration.fabric.price) {
  //   totalPrice += configuration.fabric.price;
  // }

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
  console.log("totalPrice", totalPrice);
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
  const supabaseUser = data.user;
  console.log("user", supabaseUser);

  if (!supabaseUser) {
    throw new Error("You need to be logged in");
  }

  // Make sure the user exists in the Prisma DB
  try {
    const prismaUser = await getOrCreateUser(supabaseUser);
    const userId = prismaUser.id;

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
  } catch (error: unknown) {
    console.error("Error creating order:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create order: ${error.message}`);
    } else {
      throw new Error(`Failed to create order: Unknown error`);
    }
  }
};
