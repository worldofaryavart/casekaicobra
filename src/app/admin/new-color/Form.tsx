"use client"

import React, { useState, FormEvent } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { createColor } from "./actions"

const ColorForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  // Form fields state
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [hex, setHex] = useState("#000000");
  const [tw, setTw] = useState("");

  const saveColorMutation = useMutation({
    mutationKey: ["create-color"],
    mutationFn: async (data: Parameters<typeof createColor>[0]) => {
      await createColor(data);
    },
    onSuccess: () => {
      toast({
        title: "Color created successfully",
      });
      router.push("/admin");
    },
    onError: () => {
      toast({
        title: "Failed to create color",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation
    if (!label || !value) return;

    saveColorMutation.mutate({ label, value, hex, tw });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Color Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Color Label
        </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          name="label"
          type="text"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="e.g., Sky Blue"
        />
      </div>

      {/* Color Value */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Color Value
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="value"
          type="text"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="e.g., sky-blue"
        />
      </div>

      {/* Hex Color Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Hex Color
        </label>
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          name="hex"
          type="color"
          className="mt-1 h-10 w-16 p-0 border-none"
        />
        <span className="ml-2">{hex}</span>
      </div>

      {/* Tailwind Color Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tailwind Color
        </label>
        <select
          value={tw}
          onChange={(e) => setTw(e.target.value)}
          name="tw"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Select a Tailwind Color</option>
          <option value="bg-red-500">Red</option>
          <option value="bg-blue-500">Blue</option>
          <option value="bg-green-500">Green</option>
          <option value="bg-yellow-500">Yellow</option>
          <option value="bg-purple-500">Purple</option>
        </select>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Create Color
      </button>
    </form>
  );
};

export default ColorForm;
