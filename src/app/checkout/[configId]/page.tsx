import { db } from "@/db";
import { notFound } from "next/navigation";
import Checkout from "../Checkout";

interface PageProps {
  params: {
    configId: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const CheckoutPage = async ({ params }: PageProps) => {
  const { configId } = params;
  console.log("config id is : ", configId);

  const configuration = await db.configuration.findUnique({
    where: { id: configId },
    include: {
      fabric: true,
      color: true,
      size: true,
      product: true,
    },
  });

  if (!configuration) {
    return notFound();
  }

  return <Checkout configuration={configuration} />;
};

export default CheckoutPage;
