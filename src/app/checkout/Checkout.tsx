"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useMutation } from "@tanstack/react-query";
import { Check, CreditCard, ArrowRight, Truck, Wallet } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import TShirt from "@/components/Tshirt2";
import LoginModal from "@/components/LoginModal";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { formatPrice } from "@/lib/utils";
import { COLORS, SIZES } from "@/validators/option-validator";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Configuration } from "@prisma/client";
import { createCODOrder, createStripeCheckoutSession} from "./actions";

type PaymentMethod = "stripe" | "paypal" | "upi" | "cod";

const Checkout = ({ configuration }: { configuration: Configuration }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useKindeBrowserClient();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod>("stripe");

  const { id, color, size, fabric, croppedImageUrl, width, height } =
    configuration;

  // Calculate price based on selected fabric pricing
  const calculatePrice = () => {
    if (!configuration) return BASE_PRICE;

    let totalPrice = BASE_PRICE;
    const { fabric } = configuration;

    if (fabric === "cotton") totalPrice += PRODUCT_PRICES.fabric.cotton;
    else if (fabric === "polyester")
      totalPrice += PRODUCT_PRICES.fabric.polyester;
    else if (fabric === "polycotton")
      totalPrice += PRODUCT_PRICES.fabric.polycotton;
    else if (fabric === "dotKnit") totalPrice += PRODUCT_PRICES.fabric.dotKnit;

    return totalPrice;
  };

  // Payment handling mutations
  const { mutate: processStripePayment } = useMutation({
    mutationKey: ["stripe-checkout"],
    mutationFn: createStripeCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) router.push(url);
      else throw new Error("Unable to retrieve Stripe payment URL.");
    },
    onError: () => {
      toast({
        title: "Payment Error",
        description:
          "There was an error processing your Stripe payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // const { mutate: processUPIPayment } = useMutation({
  //   mutationKey: ["upi-checkout"],
  //   mutationFn: createUPICheckoutSession,
  //   onSuccess: ({ url }) => {
  //     if (url) router.push(url);
  //     else throw new Error("Unable to retrieve UPI payment URL.");
  //   },
  //   onError: () => {
  //     toast({
  //       title: "Payment Error",
  //       description: "There was an error processing your UPI payment. Please try again.",
  //       variant: "destructive",
  //     });
  //   },
  // });

  const { mutate: processCODOrder } = useMutation({
    mutationKey: ["cod-order"],
    mutationFn: createCODOrder,
    onSuccess: ({ orderId }) => {
      if (orderId) router.push(`/thank-you?orderId=${orderId}`);
      else throw new Error("Unable to create COD order.");
    },
    onError: () => {
      toast({
        title: "Order Error",
        description: "There was an error processing your Cash on Delivery order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (!user) {
      if (id) localStorage.setItem("configurationId", id);
      setIsLoginModalOpen(true);
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Configuration ID not found",
        variant: "destructive",
      });
      return;
    }

    switch (selectedPayment) {
      case "stripe":
        processStripePayment({ configId: id });
        break;
      // case "upi":
      //   processUPIPayment({ configId: id });
      //   break;
      case "cod":
        processCODOrder({ configId: id });
        break;
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg">Loading checkout...</p>
      </div>
    );
  }

  // If configuration couldn't be loaded
  if (!configuration) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="mt-2">The requested product could not be found.</p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Return to Home
        </Button>
      </div>
    );
  }

  // Get product details
  const colorObj = COLORS.find(
    (supportedColor) => supportedColor.value === color
  );
  const colorValue = colorObj ? colorObj.value : "black";
  const { label: sizeLabel } = SIZES.options.find(
    ({ value }) => value === size
  ) || { label: "Standard" };

  const totalPrice = calculatePrice();

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="relative w-16 h-16">
            <Image
              src="/bird-1.png"
              alt="bird image"
              className="object-contain"
              fill
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-48 h-48 relative mb-4">
                  <TShirt
                    color={colorValue}
                    imgSrc={croppedImageUrl || ""}
                    width={width as number}
                    height={height as number}
                  />
                </div>

                <h3 className="font-semibold text-lg">{sizeLabel} T-Shirt</h3>

                <div className="w-full mt-6">
                  <div className="flex justify-between py-2">
                    <span>Fabric:</span>
                    <span className="font-medium capitalize">{fabric}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Color:</span>
                    <span className="font-medium capitalize">{color}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Size:</span>
                    <span className="font-medium">{sizeLabel}</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between py-2">
                    <span>Base price:</span>
                    <span>{formatPrice(BASE_PRICE / 100)}</span>
                  </div>

                  {fabric && (
                    <div className="flex justify-between py-2">
                      <span>Fabric upgrade:</span>
                      <span>
                        {formatPrice((totalPrice - BASE_PRICE) / 100)}
                      </span>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="flex justify-between py-2 font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(totalPrice / 100)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
                <CardDescription>
                  Choose your preferred payment option
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={(value) =>
                    setSelectedPayment(value as PaymentMethod)
                  }
                  className="grid grid-cols-1 gap-4"
                >
                  <div
                    className={`flex items-center space-x-2 rounded-md border p-4 ${
                      selectedPayment === "stripe"
                        ? "border-2 border-primary"
                        : ""
                    }`}
                  >
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label
                      htmlFor="stripe"
                      className="flex items-center space-x-2 cursor-pointer flex-1"
                    >
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-muted-foreground">
                          Pay securely using Stripe
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Image
                          src="/svglogos/visa-svgrepo-com.svg"
                          alt="Visa"
                          width={32}
                          height={24}
                          className="h-6 w-auto"
                        />
                        <Image
                          src="/svglogos/mastercard-svgrepo-com.svg"
                          alt="Mastercard"
                          width={32}
                          height={24}
                          className="h-6 w-auto"
                        />
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 rounded-md border p-4 ${
                      selectedPayment === "upi" ? "border-2 border-primary" : ""
                    }`}
                  >
                    <RadioGroupItem value="upi" id="upi" />
                    <Label
                      htmlFor="upi"
                      className="flex items-center space-x-2 cursor-pointer flex-1"
                    >
                      <Wallet className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-muted-foreground">
                          Pay using your UPI apps like Google Pay, PhonePe,
                          Paytm
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Image
                          src="/svglogos/google-pay-or-tez.svg"
                          alt="Google Pay"
                          width={32}
                          height={24}
                          className="h-6 w-auto"
                        />
                        <Image
                          src="/svglogos/phonepe-1.svg"
                          alt="UPI"
                          width={32}
                          height={24}
                          className="h-6 w-auto"
                        />
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 rounded-md border p-4 ${
                      selectedPayment === "cod" ? "border-2 border-primary" : ""
                    }`}
                  >
                    <RadioGroupItem value="cod" id="cod" />
                    <Label
                      htmlFor="cod"
                      className="flex items-center space-x-2 cursor-pointer flex-1"
                    >
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/configure/preview?id=${id}`)}
                >
                  Back to Preview
                </Button>
                <Button onClick={handleCheckout} disabled={!selectedPayment}>
                  Complete Order
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
