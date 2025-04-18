import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;
  console.log("searchParams", searchParams);
  console.log("id", id);
  const id_type = typeof id;
  console.log("id_type", id_type);

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  // Fetch available options from the database
  const colors = await db.tshirtColor.findMany();
  const sizes = await db.tshirtSize.findMany();
  const fabrics = await db.tshirtFabric.findMany();

  const { imageUrl, width, height } = configuration;

  // Ensure required fields are present
  if (!imageUrl || !width || !height) {
    return notFound();
  }

  return (
    <DesignConfigurator
      configId={configuration.id}
      imageDimensions={{ width, height }}
      imageUrl={imageUrl}
      colors={colors}
      sizes={sizes}
      fabrics={fabrics}
    />
  );
};

export default Page;
