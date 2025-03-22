// option-validator.ts
import { PRODUCT_PRICES } from "@/config/products";

export const COLORS = [
  { value: "black", label: "Black", tw: "black", hex: "#34495e" },
  { value: "navy_blue", label: "Navy Blue", tw: "blue-800", hex: "#2c3e50" },
  { value: "white", label: "White", tw: "white", hex: "#ecf0f1" },
  { value: "red", label: "Red", tw: "red-500", hex: "#e74c3c" },
];

export const SIZES = {
  name: "size",
  options: [
    { label: "XS", value: "xs" },
    { label: "S", value: "s" },
    { label: "M", value: "m" },
    { label: "L", value: "l" },
    { label: "XL", value: "xl" },
    { label: "XXL", value: "xxl" },
  ],
} as const;

export const FABRICS = {
  name: "fabric",
  options: [
    {
      label: "Polyester",
      value: "polyester",
      description: undefined,
      price: PRODUCT_PRICES.fabric.polyester,
    },
    {
      label: "Cotton",
      value: "cotton",
      description: undefined,
      price: PRODUCT_PRICES.fabric.cotton,
    },
    {
      label: "Polycotton",
      value: "polycotton",
      description: undefined,
      price: PRODUCT_PRICES.fabric.polycotton,
    },
    {
      label: "Dot-Knit",
      value: "dotKnit",
      description: undefined,
      price: PRODUCT_PRICES.fabric.dotKnit,
    },
  ],
} as const;

export const FINISHES = {
  name: "finish",
  options: [
    {
      label: "Roundneck",
      value: "roundneck",
      description: "The classic roundneck finish.",
      price: PRODUCT_PRICES.finish.roundneck,
    },
    {
      label: "Polo",
      value: "polo",
      description: "The classic polo finish.",
      price: PRODUCT_PRICES.finish.polo,
    },
  ],
} as const;
