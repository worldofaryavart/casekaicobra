'use server'

import { db } from '@/db';
import type { TshirtColor, TshirtSize, TshirtFabric } from '@prisma/client';

export type SaveConfigArgs = {
  color: TshirtColor;
  size: TshirtSize;
  fabric: TshirtFabric;
  configId: string;
  croppedImageUrl?: string;
  width?: number;
  height?: number;
  positionX?: number;
  positionY?: number;
};

export async function saveConfig({
  color,
  size,
  fabric,
  configId,
  croppedImageUrl,
  width,
  height,
  positionX,
  positionY,
}: SaveConfigArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: {
      colorId: color.id,
      sizeId: size.id,
      fabricId: fabric.id,
      croppedImageUrl: croppedImageUrl || undefined,
      width,     // You'll need to pass these values
      height,  // from the DesignConfigurator
      isCustom: true
    },
  });
}
