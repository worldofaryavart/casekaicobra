import Link from "next/link";
import { db } from "@/db";
import CategoryForm from "./Form";
import CategoryTable from "./Table";

// Define the Category type


export default async function NewCategoryPage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  console.log("categories is : ", categories); 

  return (
    <div className="p-8">
      <Link href="/admin">
        <div className="text-indigo-700 mb-4 inline-block">
          Back to Dashboard
        </div>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Add New Category</h1>
      <CategoryForm/>
      <div className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Categories</h1>
        <CategoryTable categories={categories} />
      </div> 
    </div>
  );
}
