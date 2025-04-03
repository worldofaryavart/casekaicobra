"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Truck, Wallet } from "lucide-react";
import Image from "next/image";
import { BASE_PRICE } from "@/config/products";

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
import LoginModal from "@/components/LoginModal";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import Input from "@/components/ui/input";
import { createCODOrder } from "./actions";
import TShirt from "@/components/Tshirt2";

// Your Checkout configuration type
type CheckoutConfiguration = {
  id: string;
  isCustom: boolean;
  width?: number | null;
  height?: number | null;
  imageUrl?: string | null;
  croppedImageUrl?: string | null;
  color?:
    | string
    | { label: string; value: string; hex?: string | null; tw?: string | null }
    | null;
  size?: { label: string; value: string } | string | null;
  fabric?:
    | { label: string; value: string; price?: number | null }
    | string
    | null;
  product?: {
    title: string;
    discountPrice: number;
    images: string[];
  } | null;
};

// Payment method type
type PaymentMethod = "upi" | "cod";

// Shipping address type expected by the server action
type ShippingAddressData = {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
  phoneNumber?: string;
};

const Checkout = ({
  configuration,
}: {
  configuration: CheckoutConfiguration;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useKindeBrowserClient();

  console.log("configuration is: ", configuration);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cod");

  const [shippingAddress, setShippingAddress] = useState<ShippingAddressData>({
    name:
      user?.given_name && user?.family_name
        ? `${user.given_name} ${user.family_name}`
        : "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    state: "",
    phoneNumber: "",
  });

  // Calculate summary values based on whether the configuration is custom or not.
  const isCustom = configuration.isCustom;
  const imageSrc = isCustom
    ? configuration.croppedImageUrl || configuration.imageUrl || ""
    : configuration.product?.images[0] || "";
  const displayedWidth = isCustom ? configuration.width : 0;
  const displayedHeight = isCustom ? configuration.height : 0;

  // Normalize display values for fabric, color and size.
  const fabricDisplay =
    configuration.fabric && typeof configuration.fabric === "object"
      ? configuration.fabric.label
      : configuration.fabric || "";
  const colorDisplay =
    configuration.color && typeof configuration.color === "object"
      ? configuration.color.label
      : configuration.color || "";
  const colorHex =
    typeof configuration.color === "string"
      ? configuration.color
      : configuration.color?.hex;
  const sizeDisplay =
    configuration.size && typeof configuration.size === "object"
      ? configuration.size.label
      : configuration.size || "";

  // Determine prices.
  let basePrice = 0;
  let totalPrice = 0;
  if (isCustom) {
    basePrice = BASE_PRICE;
    totalPrice = basePrice;
  } else if (configuration.product) {
    basePrice = configuration.product.discountPrice;
    totalPrice = basePrice;
    if (
      configuration.fabric &&
      typeof configuration.fabric === "object" &&
      configuration.fabric.price
    ) {
      totalPrice += configuration.fabric.price;
    }
  }

  // Updated mutation that now accepts both configId and shippingAddress.
  const { mutate: processCODOrder } = useMutation({
    mutationKey: ["cod-order"],
    mutationFn: async ({
      configId,
      shippingAddress,
    }: {
      configId: string;
      shippingAddress: ShippingAddressData;
    }) => {
      return await createCODOrder({ configId, shippingAddress });
    },
    onSuccess: ({ orderId }: { orderId: string }) => {
      if (orderId) router.push(`/thank-you?orderId=${orderId}`);
      else throw new Error("Unable to create COD order.");
    },
    onError: () => {
      toast({
        title: "Order Error",
        description:
          "There was an error processing your Cash on Delivery order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (!user) {
      localStorage.setItem("configurationId", configuration.id);
      setIsLoginModalOpen(true);
      return;
    }

    if (!configuration.id) {
      toast({
        title: "Error",
        description: "Configuration ID not found",
        variant: "destructive",
      });
      return;
    }

    switch (selectedPayment) {
      case "cod":
        // Now passing shippingAddress along with configId.
        processCODOrder({ configId: configuration.id, shippingAddress });
        break;
      // Add more payment methods if needed.
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg">Loading checkout...</p>
      </div>
    );
  }

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
          {/* Order Summary Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-48 h-48 relative mb-4">
                  {isCustom ? (
                    <TShirt
                      color={colorHex || "#000000"}
                      imgSrc={imageSrc || ""}
                      width={displayedWidth || 0}
                      height={displayedHeight || 0}
                    />
                  ) : (
                    <Image
                      src={imageSrc}
                      alt={"T-Shirt"}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>

                <h3 className="font-semibold text-lg">
                  {isCustom
                    ? `${sizeDisplay} Custom T-Shirt`
                    : configuration.product?.title}
                </h3>

                <div className="w-full mt-6 space-y-2">
                  <div className="flex justify-between py-1">
                    <span>Fabric:</span>
                    <span className="font-medium capitalize">
                      {fabricDisplay}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Color:</span>
                    <span className="font-medium capitalize">
                      {colorDisplay}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Size:</span>
                    <span className="font-medium">{sizeDisplay}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Discount Price:</span>
                    <span>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(basePrice)}
                    </span>
                  </div>
                  {configuration.fabric &&
                    typeof configuration.fabric === "object" &&
                    configuration.fabric.price && (
                      <div className="flex justify-between py-1">
                        <span>Fabric upgrade:</span>
                        <span>
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(configuration.fabric.price)}
                        </span>
                      </div>
                    )}
                  <div className="flex justify-between py-1 font-bold">
                    <span>Total:</span>
                    <span>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(totalPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div>
                  <h4 className="font-semibold">Shipping Address:</h4>
                  <p>{shippingAddress.name}</p>
                  <p>{shippingAddress.street}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.postalCode}
                  </p>
                  <p>
                    {shippingAddress.country}
                    {shippingAddress.state && `, ${shippingAddress.state}`}
                  </p>
                  <p>{shippingAddress.phoneNumber}</p>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Shipping & Payment Section */}
          <div className="lg:col-span-2">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>
                  Enter or confirm your shipping details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g., John Doe"
                      value={shippingAddress.name}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      name="street"
                      type="text"
                      placeholder="e.g., 123 Main St, Apt 4B"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="e.g., Anytown"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code / ZIP</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        placeholder="e.g., 12345"
                        value={shippingAddress.postalCode}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        type="text"
                        placeholder="e.g., United States"
                        value={shippingAddress.country}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State / Province (Optional)</Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        placeholder="e.g., California"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="e.g., +1 555-123-4567"
                      value={shippingAddress.phoneNumber}
                      onChange={handleAddressChange}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      May be used for delivery updates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  onClick={() =>
                    router.push(`/configure/preview?id=${configuration.id}`)
                  }
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
