'use server'

import { db } from '@/db'
import { revalidatePath } from 'next/cache'

type CreateFabricArgs = {
  label: string
  value: string
  price?: number
}

export async function createFabric({ label, value, price }: CreateFabricArgs) {
  const newFabric = await db.tshirtFabric.create({
    data: {     
      label,
      value,
      price,
    },
  })

  // Revalidate the page listing categories/products
  revalidatePath('/admin')

  return newFabric
}
