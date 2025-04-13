import Link from "next/link";
import SizeForm from "./Form";
import SizeTable from "./Table";
import { db } from "@/db";

export default async function NewSizeForm() {
  const sizes = await db.tshirtSize.findMany({
      orderBy: {
        label: "asc",
      },
    });
  
    console.log("colors is : ", sizes);

  return (
    <div className="p-8">
      <Link href="/admin">
        <div className="text-indigo-700 mb-4 inline-block">Back to Dashboard</div>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Add New Size</h1>
      <SizeForm />
       <div className="mt-8">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Fabrics</h1>
              <SizeTable sizes={sizes} />
            </div>
    </div>
  )
}
