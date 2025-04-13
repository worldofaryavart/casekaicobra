"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";

type CreateSizeArgs = {
  label: string;
  value: string;
};

export async function createSize({ label, value }: CreateSizeArgs) {
  const newSize = await db.tshirtSize.create({
    data: {
      label,
      value,
    },
  });

  // Revalidate the page listing categories/products
  revalidatePath("/admin");

  return newSize;
}

export async function deleteSize(id: string) {
  try {
    await db.tshirtSize.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting size:", error);
    return { success: false, error: "Failed to delete size" };
  }
}
