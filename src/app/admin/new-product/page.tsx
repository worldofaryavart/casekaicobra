import { db } from "@/db";
import NewProductForm from "./NewProductForm";

export default async function NewProductPage() {
  const categories = await db.category.findMany();
  const sizes = await db.tshirtSize.findMany();
  const colors = await db.tshirtColor.findMany();
  const fabrics = await db.tshirtFabric.findMany();

  return (
    <NewProductForm 
      categories={categories} 
      sizes={sizes} 
      colors={colors} 
      fabrics={fabrics} 
    />
  );
}
