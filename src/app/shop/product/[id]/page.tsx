import React from "react";
import { db } from "@/db";
import Product from "@/components/ProductComp";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetail({ params }: PageProps) {
  const productId = params.id;

  // Include the category and option relations so that product has all required fields.
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { 
      category: true,
      availableSizes: true,
      availableFabrics: true,
      availableColors: true,
    },
  });

  // Check if product exists before proceeding
  if (!product) {
    return <div>Product not found</div>;
  }

  // For similar products, filter by the same category (if exists) and exclude the current product.
  const similarProducts = await db.product.findMany({
    where: {
      // Use product.category?.id for filtering; if product has no category, this filter is omitted.
      ...(product.category ? { categoryId: product.category.id } : {}),
      id: { not: productId },
    },
    include: {
      category: true,
      availableSizes: true,
      availableFabrics: true,
      availableColors: true,
    },
  });

  return (
    <div>
      <Product product={product} similarProducts={similarProducts} />
    </div>
  );
}
