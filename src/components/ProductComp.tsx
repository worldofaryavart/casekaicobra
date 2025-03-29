"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { COLORS, FABRICS, SIZES } from "@/validators/option-validator";

// Helper function for joining class names
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

type DBProduct = {
  id: string;
  title: string;
  description: string;
  details: string;
  category: string;
  realPrice: number;
  discountPrice: number;
  images: string[];
  availableSizes: string[];
  availableFabrics: string[];
  createdAt: Date;
  updatedAt: Date;
};

type ProductProps = {
  product: DBProduct;
  similarProducts: DBProduct[];
};

const formatPrice = (priceInPaise: number) =>
  `₹${(priceInPaise / 100).toFixed(2)}`;

const Product: React.FC<ProductProps> = ({ product, similarProducts }) => {
  // Change fabric state to store a string value
  const [options, setOptions] = useState<{
    color: { value: string; label: string; hex: string };
    size: { label: string };
    fabric: string; // Store fabric as its value string
    selectedImage: string;
  }>({
    color: COLORS[0],
    size: SIZES.options[0],
    fabric: FABRICS.options[0].value, // Using the fabric's value (e.g., "cotton")
    selectedImage: product.images[0],
  });

  // Find the currently selected fabric object
  const selectedFabric = FABRICS.options.find(
    (option) => option.value === options.fabric
  );

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
              ₹{product.realPrice}
            </span>
            <span className="text-black font-bold">
              ₹{product.discountPrice}
            </span>
          </div>

          {/* Product Selectors */}
          <div className="space-y-6">
            {/* Color Selector */}
            <div className="flex flex-col gap-3">
              <Label>Color: {options.color.label}</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.label}
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
                  {SIZES.options.map((size) => (
                    <DropdownMenuItem
                      key={size.label}
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
              <Label>Fabric: {selectedFabric?.label}</Label>
              <div className="mt-3 space-y-4">
                {FABRICS.options.map((option) => (
                  <RadioGroup.Option
                    key={option.value}
                    value={option.value} // use the primitive value here
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
                    <RadioGroup.Description
                      as="span"
                      className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                    >
                      <span className="font-medium text-gray-900">
                        {formatPrice(option.price)}
                      </span>
                    </RadioGroup.Description>
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Button className="bg-indigo-700 text-white py-2 px-4 rounded hover:bg-indigo-800">
            Buy Now
          </Button>
        </div>
      </div>

      {/* Full Product Details Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-black mb-4">Product Details</h2>
        <p className="text-gray-700">{product.details}</p>
      </div>

      {/* Similar Products Section (Uncomment if needed)
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-black mb-4">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {similarProducts.map((prod) => (
            <Link key={prod.id} href={`/shop/product/${prod.id}`}>
              <div className="border rounded-lg shadow-sm p-4 flex flex-col hover:shadow-md transition">
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  className="mb-4 rounded object-cover"
                />
                <h3 className="text-xl font-bold text-black mb-2">
                  {prod.title}
                </h3>
                <div className="mt-2">
                  <span className="text-gray-500 line-through mr-2">
                    {formatPrice(prod.realPrice)}
                  </span>
                  <span className="text-black font-bold">
                    {formatPrice(prod.discountPrice)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      */}
    </div>
  );
};

export default Product;
