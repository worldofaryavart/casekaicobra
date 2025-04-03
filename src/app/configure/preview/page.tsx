import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  // Fetch configuration including relations
  const configuration = await db.configuration.findUnique({
    where: { id },
    include: {
      color: true,
      size: true,
      fabric: true,
      product: true,
    },
  });

  if (!configuration) {
    return notFound();
  }

  // Transform null values to undefined for compatibility with the expected types
  const safeConfiguration = {
    ...configuration,
    color: configuration.color
      ? { ...configuration.color, hex: configuration.color.hex ?? undefined }
      : null,
    fabric: configuration.fabric
      ? { ...configuration.fabric, price: configuration.fabric.price ?? undefined }
      : null,
  };

  return <DesignPreview configuration={safeConfiguration} />;
};

export default Page;
