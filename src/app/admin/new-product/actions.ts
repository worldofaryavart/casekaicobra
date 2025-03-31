'use server'

import { db } from '@/db'
import { revalidatePath } from 'next/cache'

export type CreateProductArgs = {
  title: string
  description: string
  details: string
  category: string  // category id
  realPrice: number
  discountPrice: number
  availableSizes: string[]      // array of TshirtSize ids
  availableFabrics: string[]    // array of TshirtFabric ids
  availableColors: string[]     // array of TshirtColor ids
  imageUrls: string[]
}

export async function createProduct(args: CreateProductArgs) {
  const {
    title,
    description,
    details,
    category, // category id
    realPrice,
    discountPrice,
    availableSizes,
    availableFabrics,
    availableColors,
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
      images: imageUrls,
      availableSizes: {
        connect: availableSizes.map(id => ({ id })),
      },
      availableFabrics: {
        connect: availableFabrics.map(id => ({ id })),
      },
      availableColors: {
        connect: availableColors.map(id => ({ id })),
      },
    },
  })

  // Revalidate the page listing products
  revalidatePath('/shop')

  return product
}
