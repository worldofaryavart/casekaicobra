'use server'

import { db } from '@/db';
import type { TshirtColor, TshirtSize, TshirtFabric } from '@prisma/client';

export type SaveConfigArgs = {
  color: TshirtColor;
  size: TshirtSize;
  fabric: TshirtFabric;
  configId: string;
};

export async function saveConfig({
  color,
  size,
  fabric,
  configId,
}: SaveConfigArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: {
      color: { connect: { id: color.id } },
      size: { connect: { id: size.id } },
      fabric: { connect: { id: fabric.id } },
    },
  });
}
