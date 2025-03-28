"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ChevronsUpDown, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { RadioGroup } from "@headlessui/react";
import { db } from "@/db";

// A helper function to join conditional class names
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// --- Type Definitions ---

type Review = {
  name: string;
  rating: number;
  comment: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  details: string;
  rating: number;
  realPrice: number;
  discountPrice: number;
  images: string[];
  category: string;
  reviews: Review[];
};

// --- Selector Options ---

const COLORS = [
  { value: "red", label: "Red", hex: "#ff0000" },
  { value: "blue", label: "Blue", hex: "#0000ff" },
  { value: "green", label: "Green", hex: "#00ff00" },
];
const SIZES = {
  options: [{ label: "S" }, { label: "M" }, { label: "L" }, { label: "XL" }],
};
const FABRICS = {
  options: [
    {
      value: "cotton",
      label: "Cotton",
      description: "Soft and breathable",
      price: 0,
    },
    {
      value: "polyester",
      label: "Polyester",
      description: "Durable and vibrant",
      price: 200,
    },
  ],
};

const formatPrice = (price: number) => `₹${price}`;

// --- Page Component Props ---

interface PageProps {
  params: {
    id: string;
  };
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

// --- Main Component ---

export default function ProductDetail({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Options state is initialized once the product is fetched
  const [options, setOptions] = useState<{
    color: { value: string; label: string; hex: string };
    size: { label: string };
    fabric: {
      value: string;
      label: string;
      description: string;
      price: number;
    };
    selectedImage: string;
  } | null>(null);

  // Fixed useEffect implementation
  useEffect(() => {
    async function fetchProduct() {
      try {
        const productId = params.id;
        // Fix 1: Proper Prisma findUnique syntax and type declaration
        const product = await db.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          setError("Product not found");
          return;
        }

        // Fix 2: Proper type conversion from DBProduct to Product
        const productData: Product = {
          ...product,
          // Add missing properties with safe defaults
          reviews: product.reviews || [],
          rating: product.rating || 0,
          // Convert string arrays to proper format if needed
          availableSizes: product.availableSizes || [],
          availableFabrics: product.availableFabrics || [],
        };

        setProduct(productData);

        // Fix 3: Correct Prisma findMany syntax
        const similarProducts = await db.product.findMany({
          where: {
            category: product.category,
            id: { not: productId },
          },
        });

        // Fix 4: Proper type conversion for similar products
        setSimilarProducts(
          similarProducts.map((sp: DBProduct) => ({
            ...sp,
            // reviews: sp.reviews || [],
            // rating: sp.rating || 0,
          })) as Product[]
        );

        // Initialize options safely
        setOptions({
          color: COLORS[0],
          size: SIZES.options[0],
          fabric: FABRICS.options[0],
          selectedImage: product.images[0],
        });
      } catch (err) {
        console.error(err);
        setError("Error loading product data");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error || !product || !options) {
    return <div>{error || "Product not found"}</div>;
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Image Gallery */}
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
                  setOptions((prev) =>
                    prev ? { ...prev, selectedImage: img } : null
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Right Side: Product Details and Options */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold text-black">{product.title}</h1>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-black font-medium">{product.rating}</span>
          </div>
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
                {COLORS.map((color) => (
                  <button
                    key={color.label}
                    onClick={() =>
                      setOptions((prev) => (prev ? { ...prev, color } : null))
                    }
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
                    setOptions((prev) =>
                      prev ? { ...prev, color: customColor } : null
                    );
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
                      onClick={() =>
                        setOptions((prev) => (prev ? { ...prev, size } : null))
                      }
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
              onChange={(val) => {
                setOptions((prev) => (prev ? { ...prev, fabric: val } : null));
              }}
            >
              <Label>Fabric</Label>
              <div className="mt-3 space-y-4">
                {FABRICS.options.map((option) => (
                  <RadioGroup.Option
                    key={option.value}
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
                        {option.description && (
                          <RadioGroup.Description
                            as="span"
                            className="text-gray-500"
                          >
                            {option.description}
                          </RadioGroup.Description>
                        )}
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

      {/* Customer Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-black mb-4">Customer Reviews</h2>
        <div className="space-y-4">
          {product.reviews.map((review, index) => (
            <div key={index} className="border p-4 rounded">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{review.rating}</span>
                <span className="text-sm text-gray-600">by {review.name}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Products Section */}
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
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-black font-medium">{prod.rating}</span>
                </div>
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
    </div>
  );
}
