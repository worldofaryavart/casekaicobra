"use client"

import React, { useState, useRef, FormEvent } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { createCategory } from "./actions"

export default function NewCategoryForm() {
  const { toast } = useToast()
  const router = useRouter()
  
  // Form fields state
  const [category, setCategory] = useState("")

  const saveCategoryMutation = useMutation({
    mutationKey: ["create-category"],
    mutationFn: async (data: Parameters<typeof createCategory>[0]) => {
      await createCategory(data)
    },
    onSuccess: () => {
      toast({
        title: "Category created successfully",
      })
      router.push("/admin")
    },
    onError: () => {
      toast({
        title: "Failed to create category",
        description: "Please try again later.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!category) return
    saveCategoryMutation.mutate({ category })
  }

  return (
    <div className="p-8">
      <Link href="/admin">
        <div className="text-indigo-700 mb-4 inline-block">Back to Dashboard</div>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Add New Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            name="category"
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

       
       
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Create Category
        </button>
      </form>
    </div>
  )
}
