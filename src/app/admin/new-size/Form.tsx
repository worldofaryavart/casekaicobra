'use client'

import React, { useState, FormEvent } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { createSize } from "./actions"

const SizeForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  // Form fields state
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  const saveSizeMutation = useMutation({
    mutationKey: ["create-size"],
    mutationFn: async (data: Parameters<typeof createSize>[0]) => {
      await createSize(data);
    },
    onSuccess: () => {
      toast({
        title: "Size created successfully",
      });
      router.push("/admin");
    },
    onError: () => {
      toast({
        title: "Failed to create size",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!label || !value) return;
    saveSizeMutation.mutate({ label, value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Size Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Size Label
        </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          name="label"
          type="text"
          required
          placeholder="e.g., Large"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      {/* Size Value */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Size Value
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="value"
          type="text"
          required
          placeholder="e.g., L"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Create Size
      </button>
    </form>
  );
};

export default SizeForm;
