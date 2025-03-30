import { db } from "@/db";
import NewProductFrom from "./NewProductForm";


export default async function NewProductForm() {
  const categories = await db.category.findMany();

  return (
    <NewProductFrom categories={categories} />
  )
}
