import { db } from "@/db";
import { notFound } from "next/navigation";
import Checkout from "./Checkout";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const CheckoutPage = async ({ searchParams }: PageProps) => {
  const { configId, productId, color, fabric, size } = searchParams;
  let configuration: any;

  if (configId && typeof configId === "string") {
    // Existing functionality: Use configId to fetch configuration from DB.
    configuration = await db.configuration.findUnique({
      where: { id: configId },
    });
    if (!configuration) {
      return notFound();
    }
  } else if (
    productId &&
    color &&
    fabric &&
    size &&
    typeof productId === "string" &&
    typeof color === "string" &&
    typeof fabric === "string" &&
    typeof size === "string"
  ) {
    // Custom order: Create a configuration object using the query parameters.
    configuration = {
      id: "custom",
      productId,
      color,
      fabric,
      size,
      // You can add additional custom fields as needed.
    };
  } else {
    return notFound();
  }

  console.log("configuration: ", configuration);

  return (
    <>
      <Checkout configuration={configuration} />
    </>
  );
};

export default CheckoutPage;
