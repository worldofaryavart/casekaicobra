'use server'

import { db } from '@/db'
import { revalidatePath } from 'next/cache'

type CreateColorArgs = {
  label: string
  value: string
  hex: string
  tw: string
}

export async function createColor({ label, value, hex, tw }: CreateColorArgs) {
  const newColor = await db.tshirtColor.create({
    data: {     
      label,
      value,
      hex,
      tw,
    },
  })

  // Revalidate the page listing categories/products
  revalidatePath('/admin')

  return newColor
}
