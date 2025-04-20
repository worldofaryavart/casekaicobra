import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { imageUrl } = searchParams;
  console.log("searchParams", searchParams);

  if (!imageUrl || typeof imageUrl !== "string") {
    console.log("imageUrl is not a string or is undefined");
    return notFound();
  }

  // Fetch available options from the database
  const colors = await db.tshirtColor.findMany();
  const sizes = await db.tshirtSize.findMany();
  const fabrics = await db.tshirtFabric.findMany();

  return (
    // <div>
    //   <img src={imageUrl} alt="Design" width={500} height={500} />
    //   <h1 className="text-2xl font-bold">Design Your T-Shirt</h1>
    // </div>
    <DesignConfigurator
      imageUrl={imageUrl}
      colors={colors}
      sizes={sizes}
      fabrics={fabrics}
    />
  );
};

export default Page;
