/*
  Warnings:

  - You are about to drop the column `color` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `fabric` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `availableColors` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `availableFabrics` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `availableSizes` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "color",
DROP COLUMN "fabric",
DROP COLUMN "size",
ADD COLUMN     "colorId" TEXT,
ADD COLUMN     "fabricId" TEXT,
ADD COLUMN     "sizeId" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "availableColors",
DROP COLUMN "availableFabrics",
DROP COLUMN "availableSizes";

-- DropEnum
DROP TYPE "Fabric";

-- DropEnum
DROP TYPE "TshirtColor";

-- DropEnum
DROP TYPE "TshirtSize";

-- CreateTable
CREATE TABLE "TshirtColor" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "tw" TEXT,
    "hex" TEXT,

    CONSTRAINT "TshirtColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TshirtSize" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "TshirtSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TshirtFabric" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "price" DOUBLE PRECISION,

    CONSTRAINT "TshirtFabric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductSizes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductFabrics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductColors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductSizes_AB_unique" ON "_ProductSizes"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductSizes_B_index" ON "_ProductSizes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductFabrics_AB_unique" ON "_ProductFabrics"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductFabrics_B_index" ON "_ProductFabrics"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductColors_AB_unique" ON "_ProductColors"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductColors_B_index" ON "_ProductColors"("B");

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "TshirtColor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "TshirtSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_fabricId_fkey" FOREIGN KEY ("fabricId") REFERENCES "TshirtFabric"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSizes" ADD CONSTRAINT "_ProductSizes_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSizes" ADD CONSTRAINT "_ProductSizes_B_fkey" FOREIGN KEY ("B") REFERENCES "TshirtSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductFabrics" ADD CONSTRAINT "_ProductFabrics_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductFabrics" ADD CONSTRAINT "_ProductFabrics_B_fkey" FOREIGN KEY ("B") REFERENCES "TshirtFabric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductColors" ADD CONSTRAINT "_ProductColors_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductColors" ADD CONSTRAINT "_ProductColors_B_fkey" FOREIGN KEY ("B") REFERENCES "TshirtColor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
