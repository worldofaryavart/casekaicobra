"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { BillingAddress, Configuration, Order, Product, ShippingAddress, TshirtColor, TshirtFabric, TshirtSize, User } from "@prisma/client";

export const getPaymentStatus = async ({
  orderId,
}: {
  orderId: string;
}): Promise<Order & {
  configuration: Configuration & {
    product: Product | null;
    fabric: TshirtFabric | null;
    color: TshirtColor | null;
    size: TshirtSize | null;
  };
  shippingAddress: ShippingAddress | null;
  billingAddress: BillingAddress | null;
  user: User;
} | false> => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    throw new Error("You need to be logged in to view this page.");
  }

  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      billingAddress: true,
      shippingAddress: true,
      configuration: {
        include: {
          product: true,
          fabric: true,
          color: true,
          size: true,
        },
      },
      user: true,
    },
  });

  if (!order) throw new Error("This order does not exist.");

  return order;
};
