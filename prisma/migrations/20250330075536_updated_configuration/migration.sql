-- AlterTable
ALTER TABLE "Configuration" ADD COLUMN     "isCustom" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "productId" TEXT,
ALTER COLUMN "width" DROP NOT NULL,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
