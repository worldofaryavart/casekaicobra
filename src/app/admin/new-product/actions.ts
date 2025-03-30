'use server'

import { db } from '@/db'
import { TshirtSize, Fabric } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export type CreateProductArgs = {
  title: string
  description: string
  details: string
  category: string  // changed from string[] to string (the category id)
  realPrice: number
  discountPrice: number
  availableSizes: TshirtSize[]  // values should match your enum (e.g. "xs", "s", etc.)
  availableFabrics: Fabric[]     // e.g. "polyester", "cotton", etc.
  imageUrls: string[]
}

export async function createProduct(args: CreateProductArgs) {
  const {
    title,
    description,
    details,
    category, // this is now the category id
    realPrice,
    discountPrice,
    availableSizes,
    availableFabrics,
    imageUrls,
  } = args

  const product = await db.product.create({
    data: {
      title,
      description,
      details,
      category: {
        connect: { id: category },
      },
      realPrice,
      discountPrice,
      images: imageUrls, // Assuming your schema defines images as String[]
      availableSizes,    // Stored as array of TshirtSize
      availableFabrics,  // Stored as array of Fabric
    },
  })

  // Optionally revalidate the page listing products
  revalidatePath('/shop')

  return product
}
