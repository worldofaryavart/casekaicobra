"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "./actions";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import TShirt from "@/components/Tshirt2"; // Assuming TShirt component exists
import {
  Order,
  Configuration,
  ShippingAddress,
  TshirtColor,
  Product,
  TshirtFabric,
  TshirtSize,
  BillingAddress,
} from "@prisma/client";
import Image from "next/image";

type ExtendedOrder = Order & {
  configuration: Configuration & {
    product: Product | null;
    fabric: TshirtFabric | null;
    color: TshirtColor | null;
    size: TshirtSize | null;
  };
  shippingAddress: ShippingAddress | null;
  billingAddress: BillingAddress | null;
};

type PaymentStatusResponse = ExtendedOrder | false;

const ThankYou = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const { data, isLoading } = useQuery<PaymentStatusResponse>({
    queryKey: ["get-payment-status", orderId],
    queryFn: async () => await getPaymentStatus({ orderId }),
    retry: true,
    retryDelay: 500,
  });

  console.log("data is : ", data);

  if (isLoading || data === undefined) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Loading your order...</h3>
          <p>This won't take long.</p>
        </div>
      </div>
    );
  }

  if (data === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  const { configuration, shippingAddress, amount, isPaid } = data;
  console.log("Amount : ", amount);
  console.log("Shipping Address : ", shippingAddress);
  const imgSrc =
    configuration.croppedImageUrl ||
    configuration.imageUrl ||
    configuration.product?.images?.[0] ||
    "";
  const paymentDisplay = isPaid ? "Paid" : "Pending";
  const color = configuration.color?.value || "";

  // For custom orders
  const { isCustom, width, height, croppedImageUrl } = configuration;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-base font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your T-Shirt is on the way!
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            We've received your order and are now processing it.
          </p>

          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Order number</p>
            <p className="mt-2 text-zinc-500">{orderId}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              You made a great choice!
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              We at CHICHORÉ believe that a T-Shirt not only looks great but is
              built to last.
            </p>
          </div>
        </div>

        {/* Conditional Rendering based on isCustom */}
        {isCustom ? (
          <div className="w-full max-w-xs">
            <TShirt
              color={color}
              imgSrc={croppedImageUrl || ""}
              width={width as number}
              height={height as number}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
            <div className="relative w-64 h-64">
              <Image
                src={imgSrc}
                alt="T-Shirt"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        <div>
          <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
            <div>
              <p className="font-medium text-gray-900">Shipping address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{shippingAddress?.name}</span>
                  <span className="block">{shippingAddress?.street}</span>
                  <span className="block">
                    {shippingAddress?.postalCode} {shippingAddress?.city}
                  </span>
                  <span className="block">{shippingAddress?.country}</span>
                </address>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Payment status</p>
              <p className="mt-2 text-zinc-700">{paymentDisplay}</p>
            </div>
            <div>
              <p className="font-medium text-zinc-900">Expected Delivery</p>
              <p className="mt-2 text-zinc-700">
                Usually delivered within 4–5 working days.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Total</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
