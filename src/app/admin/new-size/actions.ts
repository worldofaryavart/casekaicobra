'use server'

import { db } from '@/db'
import { revalidatePath } from 'next/cache'

type CreateSizeArgs = {
  label: string
  value: string
}

export async function createSize({ label, value }: CreateSizeArgs) {
  const newSize = await db.tshirtSize.create({
    data: {     
      label,
      value,
    },
  })

  // Revalidate the page listing categories/products
  revalidatePath('/admin')

  return newSize
}
