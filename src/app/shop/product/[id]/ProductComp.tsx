"use client";

import React, { useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { RadioGroup } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { createConfiguration } from "./actions"; 

// Updated Category type
type Category = {
  id: string;
  name: string;
};

// Updated DBProduct type reflecting option objects
type DBProduct = {
  id: string;
  title: string;
  description: string;
  details: string;
  category: Category | null;
  realPrice: number;
  discountPrice: number;
  images: string[];
  availableSizes: { id: string; label: string; value: string }[];
  availableFabrics: {
    id: string;
    label: string;
    value: string;
    price?: number | null;
  }[];
  availableColors: {
    id: string;
    label: string;
    value: string;
    hex?: string | null;
    tw?: string | null;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

type ProductProps = {
  product: DBProduct;
  similarProducts: DBProduct[];
};

const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

// Helper function for joining class names
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

const Product: React.FC<ProductProps> = ({ product, similarProducts }) => {
  const { toast } = useToast();
  const router = useRouter();

  // Map availableColors, sizes, and fabrics to the options used by the selectors.
  // We now include the id so that we can pass it to our action.
  const colors = product.availableColors.map((c) => ({
    id: c.id,
    value: c.value,
    label: c.label,
    hex: c.hex || c.value, // fallback if hex is missing
  }));

  const sizes = product.availableSizes.map((s) => ({
    id: s.id,
    label: s.label,
    value: s.value,
  }));

  const fabrics = product.availableFabrics.map((f) => ({
    id: f.id,
    value: f.value,
    label: f.label,
    price: f.price || 0,
  }));

  // Create fallback objects if any array is empty
  const defaultColor =
    colors.length > 0 ? colors[0] : { id: "", value: "", label: "", hex: "#ffffff" };
  const defaultSize = sizes.length > 0 ? sizes[0] : { id: "", label: "", value: "" };
  const defaultFabric =
    fabrics.length > 0 ? fabrics[0] : { id: "", value: "", label: "", price: 0 };
  const defaultImage = product.images.length > 0 ? product.images[0] : "";

  // Set initial state using the mapped arrays with fallbacks
  const [options, setOptions] = useState<{
    color: { id: string; value: string; label: string; hex: string };
    size: { id: string; label: string; value: string };
    fabric: { id: string; value: string; label: string; price: number };
    selectedImage: string;
  }>({
    color: defaultColor,
    size: defaultSize,
    fabric: defaultFabric,
    selectedImage: defaultImage,
  });

  const { mutate: createConfig } = useMutation({
    mutationKey: ["create-configuration"],
    mutationFn: createConfiguration,
    onSuccess: (data: { url: string }) => {
      if (data.url) router.push(data.url);
      else throw new Error("Unable to create configuration.");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handler for the Buy Now button
  const handleBuy = () => {
    console.log("Product ID:", product.id);
    console.log("Selected Color:", options.color);
    console.log("Selected Fabric:", options.fabric);
    console.log("Selected Size:", options.size);
  
    createConfig({
      productId: product.id,
      colorId: options.color.id,
      sizeId: options.size.id,
      fabricId: options.fabric.id,
      imageUrl: options.selectedImage,
    });
  };
  

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={options.selectedImage}
            alt={product.title}
            className="w-full rounded mb-4 object-cover"
          />
          <div className="flex space-x-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} ${index + 1}`}
                className={cn(
                  "w-16 h-16 object-cover rounded cursor-pointer border",
                  options.selectedImage === img
                    ? "border-indigo-700"
                    : "border-gray-300"
                )}
                onClick={() =>
                  setOptions((prev) => ({ ...prev, selectedImage: img }))
                }
              />
            ))}
          </div>
        </div>

        {/* Right Side: Product Details and Options */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold text-black">{product.title}</h1>
          <p className="text-gray-700">{product.description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 line-through">
              {formatPrice(product.realPrice)}
            </span>
            <span className="text-black font-bold">
              {formatPrice(product.discountPrice)}
            </span>
          </div>

          {/* Product Selectors */}
          <div className="space-y-6">
            {/* Color Selector */}
            <div className="flex flex-col gap-3">
              <Label>Color: {options.color.label}</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setOptions((prev) => ({ ...prev, color }))}
                    className={cn(
                      "relative flex cursor-pointer items-center justify-center rounded-full p-0.5 border-2 border-transparent hover:border-gray-400 transition-all",
                      color.value === options.color.value && "border-black"
                    )}
                    aria-label={color.label}
                  >
                    <span
                      className="h-8 w-8 rounded-full border border-black border-opacity-10"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
              <div className="flex items-center mt-2">
                <Label className="mr-3 text-sm">Custom:</Label>
                <input
                  type="color"
                  value={options.color.hex}
                  onChange={(e) => {
                    const customColor = {
                      id: "custom",
                      value: "custom",
                      label: "Custom",
                      hex: e.target.value,
                    };
                    setOptions((prev) => ({ ...prev, color: customColor }));
                  }}
                  className="h-8 w-8 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Size Selector */}
            <div className="relative flex flex-col gap-3 w-full">
              <Label>Size</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {options.size.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {sizes.map((size) => (
                    <DropdownMenuItem
                      key={size.id}
                      className={cn(
                        "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                        size.label === options.size.label && "bg-zinc-100"
                      )}
                      onClick={() => setOptions((prev) => ({ ...prev, size }))}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          size.label === options.size.label
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {size.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Fabric Selector */}
            <RadioGroup
              value={options.fabric}
              onChange={(val) =>
                setOptions((prev) => ({ ...prev, fabric: val }))
              }
            >
              <Label>Fabric: {options.fabric.label}</Label>
              <div className="mt-3 space-y-4">
                {fabrics.map((option) => (
                  <RadioGroup.Option
                    key={option.id}
                    value={option}
                    className={({ active, checked }) =>
                      cn(
                        "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none",
                        (active || checked) && "border-indigo-700"
                      )
                    }
                  >
                    <span className="flex items-center">
                      <span className="flex flex-col text-sm">
                        <RadioGroup.Label
                          className="font-medium text-gray-900"
                          as="span"
                        >
                          {option.label}
                        </RadioGroup.Label>
                      </span>
                    </span>
                    {/* <RadioGroup.Description
                      as="span"
                      className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                    >
                      <span className="font-medium text-gray-900">
                        {formatPrice(option.price)}
                      </span>
                    </RadioGroup.Description> */}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleBuy}
            className="bg-indigo-700 text-white py-2 px-4 rounded hover:bg-indigo-800"
          >
            Buy Now
          </Button>
        </div>
      </div>

      {/* Full Product Details Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-black mb-4">Product Details</h2>
        <p className="text-gray-700">{product.details}</p>
      </div>
    </div>
  );
};

export default Product;
