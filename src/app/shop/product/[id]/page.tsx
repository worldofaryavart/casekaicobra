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

  // Include the category relation so that product.category exists.
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });

  // Check if product exists before proceeding
  if (!product) {
    return <div>Product not found</div>;
  }

  // Use product.categoryId for filtering and include the category for similar products as well.
  const similarProducts = await db.product.findMany({
    where: {
      // Use the categoryId for filtering similar products
      categoryId: product.categoryId,
      id: { not: productId },
    },
    include: { category: true },
  });

  console.log("product detail is : ", product);

  return (
    <div>
      <Product product={product} similarProducts={similarProducts} />
    </div>
  );
}
