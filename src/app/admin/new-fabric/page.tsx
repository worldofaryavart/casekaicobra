import Link from "next/link";
import FabricForm from "./Form";
import FabricTable from "./Table";
import { db } from "@/db";

export default async function NewFabricForm() {
  const fabrics = await db.tshirtFabric.findMany({
    orderBy: {
      label: "asc",
    },
  });

  console.log("colors is : ", fabrics);

  return (
    <div className="p-8">
      <Link href="/admin">
        <div className="text-indigo-700 mb-4 inline-block">
          Back to Dashboard
        </div>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Add New Fabric</h1>
      <FabricForm />
      <div className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Fabrics</h1>
        <FabricTable fabrics={fabrics} />
      </div>
    </div>
  );
}
