"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { createCODOrder } from "./actions";
import Input from "@/components/ui/input";

// Define a type for configuration data as passed to Checkout.
// It supports both full objects (from the DB) or plain strings from query parameters.
type CheckoutConfiguration = {
  id: string;
  color?:
    | { label: string; value: string; hex?: string | null; tw?: string | null }
    | string;
  size?: { label: string; value: string } | string;
  fabric?: { label: string; value: string; price?: number | null } | string;
  croppedImageUrl?: string | null;
  width?: number | null;
  height?: number | null;
};

type PaymentMethod = "stripe" | "paypal" | "upi" | "cod";

const Checkout = ({
  configuration,
}: {
  configuration: CheckoutConfiguration;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useKindeBrowserClient();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cod");
  const [shippingAddress, setShippingAddress] = useState({
    name:
      user?.given_name && user?.family_name
        ? `${user.given_name} ${user.family_name}`
        : "", // Pre-fill name if available
    street: "",
    city: "",
    postalCode: "",
    country: "",
    state: "",
    phoneNumber: "",
  });

  // Extract configuration fields with support for both object and string types.
  const configColor =
    typeof configuration.color === "string"
      ? {
          label: configuration.color,
          value: configuration.color,
          hex: configuration.color,
        }
      : configuration.color ?? {
          label: "Default",
          value: "default",
          hex: "#000000",
        };
  const configSize =
    typeof configuration.size === "string"
      ? { label: configuration.size, value: configuration.size }
      : configuration.size ?? { label: "Standard", value: "standard" };
  const configFabric =
    typeof configuration.fabric === "string"
      ? { label: configuration.fabric, value: configuration.fabric, price: 0 }
      : configuration.fabric ?? {
          label: "Default",
          value: "default",
          price: 0,
        };

  const { id, croppedImageUrl, width, height } = configuration;

  // Price calculation based on fabric value
  const calculatePrice = () => {
    let totalPrice = BASE_PRICE;
    const fabricValue = configFabric.value.toLowerCase();

    if (fabricValue === "cotton") totalPrice += PRODUCT_PRICES.fabric.cotton;
    else if (fabricValue === "polyester")
      totalPrice += PRODUCT_PRICES.fabric.polyester;
    else if (fabricValue === "polycotton")
      totalPrice += PRODUCT_PRICES.fabric.polycotton;
    else if (fabricValue === "dotknit")
      totalPrice += PRODUCT_PRICES.fabric.dotKnit;

    return totalPrice;
  };

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
        description:
          "There was an error processing your Cash on Delivery order. Please try again.",
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
      case "cod":
        processCODOrder({ configId: id });
        break;
    }
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Map option data for order summary display using our configuration
  const colorDisplay = configColor.label;
  const sizeDisplay = configSize.label;
  const fabricDisplay = configFabric.label;
  const totalPrice = calculatePrice();

  // For TShirt component, derive a color value (using hex if available)
  const tshirtColor = configColor.hex ? configColor.hex : "black";

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
                    color={tshirtColor}
                    imgSrc={croppedImageUrl || ""}
                    width={width || 0}
                    height={height || 0}
                  />
                </div>

                <h3 className="font-semibold text-lg">{sizeDisplay} T-Shirt</h3>

                <div className="w-full mt-6">
                  <div className="flex justify-between py-2">
                    <span>Fabric:</span>
                    <span className="font-medium capitalize">
                      {fabricDisplay}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Color:</span>
                    <span className="font-medium capitalize">
                      {colorDisplay}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Size:</span>
                    <span className="font-medium">{sizeDisplay}</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between py-2">
                    <span>Base price:</span>
                    <span>{formatPrice(BASE_PRICE / 100)}</span>
                  </div>

                  {fabricDisplay && (
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
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>
                  Enter or confirm your shipping details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Full Name - full width */}
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
                      className="my-custom-class"
                    />
                  </div>

                  {/* Street Address - full width */}
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

                  {/* City and Postal Code in one row */}
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

                  {/* Country and State in one row */}
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

                  {/* Phone Number - full width */}
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
              {/* CardFooter can be added here if needed */}
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
