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
  const product = await db.product.findUnique({
    where: { id: productId },
  });

  // Check if product exists before proceeding
  if (!product) {
    return <div>Product not found</div>;
  }

  // Find similar products
  const similarProducts = await db.product.findMany({
    where: {
      category: product.category,
      id: { not: productId },
    },
  });

  console.log("product detail is : ", product);

  return (
    <div>
      <Product product={product} similarProducts={similarProducts} />
    </div>
  );
}
