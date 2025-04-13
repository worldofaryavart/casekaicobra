import Link from "next/link";
import ColorForm from "./Form";
import { db } from "@/db";
import ColorTable from "./Table";

export default async function NewColorPage() {
  const colors = await db.tshirtColor.findMany({
    orderBy: {
      label: "asc",
    },
  });

  console.log("categories is : ", colors);
  return (
    <div className="p-8">
      <Link href="/admin">
        <div className="text-indigo-700 mb-4 inline-block">
          Back to Dashboard
        </div>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Add New Color</h1>
      <ColorForm />
      <div className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Colors</h1>
        <ColorTable colors={colors} />
      </div>
    </div>
  );
}
