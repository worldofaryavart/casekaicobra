// option-validator.ts
import { PRODUCT_PRICES } from "@/config/products";

export const COLORS = [
  { label: "Black", value: "black", tw: "zinc-900" },
  {
    label: "Navy Blue",
    value: "navy_blue",
    tw: "navy-950", // Tailwind now knows this color from the config
  },
  { label: "White", value: "white", tw: "white-950" },
  { label: "Red", value: "red", tw: "red-950" }, // newly added red color
] as const;

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
