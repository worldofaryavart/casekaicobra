"use client"

import React, { useState, useEffect, FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createCategory, deleteCategory, getCategories } from "./actions"; // Import getCategories
import { Button } from "@/components/ui/button";


const CategoryForm = () => {
  const [category, setCategory] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const saveCategoryMutation = useMutation({
    mutationKey: ["create-category"],
    mutationFn: async (data: { category: string }) => {
      await createCategory(data);
    },
    onSuccess: () => {
      toast({
        title: "Category created successfully",
      });
      setCategory(""); // Clear the input
    //   refetch(); // Refresh the categories list
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Failed to create category",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) return;
    saveCategoryMutation.mutate({ category });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          type="text"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <Button
        type="submit"
        className="bg-green-600 text-white rounded"
        disabled={saveCategoryMutation.isPending}
      >
        {saveCategoryMutation.isPending ? "Creating..." : "Create Category"}
      </Button>
    </form>
  );
};

export default CategoryForm;
