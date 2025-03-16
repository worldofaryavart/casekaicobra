'use server'

import { db } from '@/db'
import { TshirtColor, TshirtSize, Fabric } from '@prisma/client';

export type SaveConfigArgs = {
  color: TshirtColor
  size: TshirtSize
  fabric: Fabric
  configId: string
}

export async function saveConfig({
  color,
  size,
  fabric,
  configId,
}: SaveConfigArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: { color, size, fabric },
  })
}
