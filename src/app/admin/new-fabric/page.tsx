"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createFabric } from "./actions";

export default function NewFabricForm() {
  const { toast } = useToast();
  const router = useRouter();

  // Form fields state
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [price, setPrice] = useState("");

  const saveFabricMutation = useMutation({
    mutationKey: ["create-fabric"],
    mutationFn: async (data: Parameters<typeof createFabric>[0]) => {
      await createFabric(data);
    },
    onSuccess: () => {
      toast({
        title: "Fabric created successfully",
      });
      router.push("/admin");
    },
    onError: () => {
      toast({
        title: "Failed to create fabric",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!label || !value) return;
    const fabricPrice = price === "" ? undefined : Number(price);
    saveFabricMutation.mutate({ label, value, price: fabricPrice });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  return (
    <div className="p-8">
      <Link href="/admin">
        <div className="text-indigo-700 mb-4 inline-block">
          Back to Dashboard
        </div>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Add New Fabric</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fabric Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fabric Label
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            name="label"
            type="text"
            required
            placeholder="e.g., Cotton"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Fabric Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fabric Value
          </label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            name="value"
            type="text"
            required
            placeholder="e.g., cotton"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Fabric Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Extra Cost (optional)
          </label>
          <input
            value={price}
            onChange={handlePriceChange}
            name="price"
            type="number"
            step="0.01"
            placeholder="e.g., 5.99"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Create Fabric
        </button>
      </form>
    </div>
  );
}
