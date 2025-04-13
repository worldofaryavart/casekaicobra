"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";

type CreateFabricArgs = {
  label: string;
  value: string;
  price?: number;
};

export async function createFabric({ label, value, price }: CreateFabricArgs) {
  const newFabric = await db.tshirtFabric.create({
    data: {
      label,
      value,
      price,
    },
  });

  // Revalidate the page listing categories/products
  revalidatePath("/admin");

  return newFabric;
}

export async function deleteFabric(id: string) {
  try {
    await db.tshirtFabric.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting fabric:", error);
    return { success: false, error: "Failed to delete fabric" };
  }
}
