import { db } from "@/db";
import { notFound } from "next/navigation";
import Checkout from "./Checkout";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const CheckoutPage = async ({ searchParams }: PageProps) => {
  const { configId } = searchParams;
  if (!configId || typeof configId !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
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
