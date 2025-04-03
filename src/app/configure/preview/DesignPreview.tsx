"use client";

import { Button } from "@/components/ui/button";
import { BASE_PRICE } from "@/config/products";
import { formatPrice } from "@/lib/utils";
import { Configuration } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { createCheckoutSession } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import LoginModal from "@/components/LoginModal";
import TShirt from "@/components/Tshirt2";

interface DesignPreviewProps {
  configuration: Configuration & {
    color: { id: string; label: string; value: string; hex?: string } | null;
    size: { id: string; label: string; value: string } | null;
    fabric: { id: string; label: string; value: string; price?: number } | null;
    product?: { id: string; realPrice: number; discountPrice: number } | null;
  };
}

const DesignPreview = ({ configuration }: DesignPreviewProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { id, color, size, fabric, croppedImageUrl, width, height } = configuration;
  console.log("Configuration: ", configuration);

  const { user } = useKindeBrowserClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  useEffect(() => setShowConfetti(true), []);

  // Use the related color value (defaulting to black if missing)
  const colorValue = color?.hex || "#000000";
  const sizeLabel = size?.label || "Standard";

  // The total price will be computed in the checkout action;
  // here we show a base price (for display) using BASE_PRICE.
  const totalPrice = BASE_PRICE + ((fabric?.price || 0)*100);

  const handleCheckout = () => {
    // if (user) {
    router.push(`/checkout/${id}`);
    // } else {
    //   localStorage.setItem("configurationId", id);
    //   setIsLoginModalOpen(true);
    // }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti active={showConfetti} config={{ elementCount: 200, spread: 90 }} />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="md:col-span-4 lg:col-span-3">
          <TShirt
            color={colorValue}
            imgSrc={croppedImageUrl || ""}
            width={width as number}
            height={height as number}
          />
        </div>

        <div className="mt-6 sm:col-span-9">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {sizeLabel} T-Shirt
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            In stock and ready to ship
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High-quality, breathable fabric</li>
                <li>Comfortable fit and design</li>
                <li>Durable print with eco-friendly inks</li>
                <li>Machine washable</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Fabric Details</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Soft and comfortable</li>
                <li>Long-lasting color and quality</li>
              </ol>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Base price</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE / 100)}
                  </p>
                </div>

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order total</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPrice / 100)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button onClick={handleCheckout} className="px-4 sm:px-6 lg:px-8">
                Check out <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview;
