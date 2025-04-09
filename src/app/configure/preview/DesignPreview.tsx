"use client";

import { Button } from "@/components/ui/button";
import { BASE_PRICE } from "@/config/products";
import { formatPrice } from "@/lib/utils";
import { Configuration } from "@prisma/client";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
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
  
  const { user } = useKindeBrowserClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  useEffect(() => setShowConfetti(true), []);

  // Use the related color value (defaulting to white if missing)
  const colorValue = color?.value || "white";
  const sizeLabel = size?.label || "Standard";

  // The total price will be computed in the checkout action
  const totalPrice = BASE_PRICE + ((fabric?.price || 0)*100);

  const handleCheckout = () => {
    router.push(`/checkout/${id}`);
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

      <div className="mt-8 flex flex-col md:grid md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
        {/* T-shirt preview - adjusting column span and adding card-like container */}
        <div className="md:col-span-5 lg:col-span-4 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
          <div className="w-full max-w-xs">
            <TShirt
              color={colorValue}
              imgSrc={croppedImageUrl || ""}
              width={width as number}
              height={height as number}
            />
          </div>
        </div>

        {/* Product details */}
        <div className="mt-6 md:mt-0 md:col-span-7 lg:col-span-8">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Your {sizeLabel} T-Shirt
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-green-600">In stock and ready to ship</span>
          </div>
          
          {/* Highlights section */}
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 border-b border-gray-200 py-6">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ul className="mt-2 text-zinc-700 list-disc list-inside space-y-1">
                <li>High-quality, breathable fabric</li>
                <li>Comfortable fit and design</li>
                <li>Durable print with eco-friendly inks</li>
                <li>Machine washable</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Fabric Details</p>
              <ul className="mt-2 text-zinc-700 list-disc list-inside space-y-1">
                <li>Soft and comfortable</li>
                <li>Long-lasting color and quality</li>
              </ul>
            </div>
          </div>

          {/* Pricing section */}
          <div className="mt-6">
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1">
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

            <div className="mt-6 flex justify-end">
              <Button onClick={handleCheckout} className="px-4 sm:px-6">
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