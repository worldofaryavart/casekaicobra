'use server'

import { db } from '@/db'
import { revalidatePath } from 'next/cache'

type CreateCategoryArgs = {
  category: string
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
