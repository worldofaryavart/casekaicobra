import { db } from "@/db";
import { notFound } from "next/navigation";
import Checkout from "../Checkout";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
  const supabase = await createClient();
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return redirect("/sign-in");
    }

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

  return <Checkout configuration={configuration} user={user}/>;
};

export default CheckoutPage;
