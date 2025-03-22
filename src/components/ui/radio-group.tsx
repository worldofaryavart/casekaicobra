"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

// The container for radio items
const RadioGroup = RadioGroupPrimitive.Root;

// The item component
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    // Here you can add default styling. Adjust the classes as needed.
    className={`h-4 w-4 rounded-full border border-gray-300 focus:outline-none ${className || ""}`}
    {...props}
  />
));

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
