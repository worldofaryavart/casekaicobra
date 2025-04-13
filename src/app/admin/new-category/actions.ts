'use server'

import { db } from '@/db'
import { revalidatePath } from 'next/cache'

type CreateCategoryArgs = {
  category: string
}

export async function getCategories() {
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  console.log("categories is : ", categories);
  
  return categories;
}

export async function createCategory({ category }: CreateCategoryArgs) {
  const newCategory = await db.category.create({
    data: {
      name: category,
    },
  })

  // Revalidate the page listing categories/products
  revalidatePath('/admin')

  return newCategory
}

export async function deleteCategory(id: string) {
  try {
    await db.category.delete({
      where: {
        id: id,
      },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

type EditCategoryArgs = {
  id: string;
  name: string;
};

export async function editCategory({ id, name }: EditCategoryArgs) {
  try {
    await db.category.update({
      where: { id },
      data: { name },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error editing category:", error);
    return { success: false, error: "Failed to edit category" };
  }
}