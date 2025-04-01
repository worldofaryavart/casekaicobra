'use server'

import { db } from '@/db'
import { revalidatePath } from 'next/cache'

type CreateConfigurationArgs = {
  productId: string
  colorId: string
  sizeId: string
  fabricId: string
  imageUrl?: string
}

export async function createConfiguration({
  productId,
  colorId,
  sizeId,
  fabricId,
  imageUrl,
}: CreateConfigurationArgs) {
  const newConfiguration = await db.configuration.create({
    data: {
      productId,
      colorId,
      sizeId,
      fabricId,
      imageUrl,
      isCustom: true,
    },
  })

  // Revalidate the admin page (or another relevant page)
  revalidatePath('/admin')

  // Return a URL to redirect the user to the newly created configuration details page
  return { url: `/configurations/${newConfiguration.id}` }
}
