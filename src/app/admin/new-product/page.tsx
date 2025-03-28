// app/admin/new-product/NewProductForm.tsx
"use client"

import React, { useState, useRef, FormEvent } from "react"
import Link from "next/link"
import { useUploadThing } from "@/lib/uploadthing"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { createProduct } from "./actions"
import { useToast } from "@/components/ui/use-toast"

export default function NewProductForm() {
  const { toast } = useToast()
  const router = useRouter()
  
  // Form fields state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [details, setDetails] = useState("")
  const [category, setCategory] = useState("")
  const [realPrice, setRealPrice] = useState<number>(0)
  const [discountPrice, setDiscountPrice] = useState<number>(0)
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [availableFabrics, setAvailableFabrics] = useState<string[]>([])
  
  // Image state for previewing files before upload
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Uploadthing hook for images
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        // Extract URLs from the upload result.
        const uploadedUrls = res.map((r) => r.url)
        // Call mutation to create the product in your database.
        saveProductMutation.mutate({
          title,
          description,
          details,
          category,
          realPrice,
          discountPrice,
          availableSizes: availableSizes as any, // ensure these match your TshirtSize enum
          availableFabrics: availableFabrics as any, // ensure these match your Fabric enum
          imageUrls: uploadedUrls,
        })
      }
    },
    onUploadProgress: (p) => {
      // Optionally update a progress indicator
    },
  })

  const saveProductMutation = useMutation({
    mutationKey: ["create-product"],
    mutationFn: async (data: Parameters<typeof createProduct>[0]) => {
      await createProduct(data)
    },
    onSuccess: () => {
      toast({
        title: "Product created successfully",
      })
      router.push("/shop")
    },
    onError: () => {
      toast({
        title: "Failed to create product",
        description: "Please try again later.",
        variant: "destructive",
      })
    },
  })

  // Trigger hidden file input click
  const handleAddImageClick = () => {
    fileInputRef.current?.click()
  }

  // When files are selected, update state for previews
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...newFiles])
      e.target.value = ""
    }
  }

  // On form submission, start image upload first
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (imageFiles.length === 0) {
      toast({ title: "Please add at least one image" })
      return
    }
    // Initiate the image upload
    startUpload(imageFiles,{})
  }

  return (
    <div className="p-8">
      <Link href="/admin">
        <div className="text-indigo-700 mb-4 inline-block">Back to Dashboard</div>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            name="title"
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          ></textarea>
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            name="details"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            name="category"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Category</option>
            <option value="This Week Collection">This Week Collection</option>
            <option value="New Arrivals">New Arrivals</option>
            <option value="Trending">Trending</option>
            <option value="Sale">Sale</option>
          </select>
        </div>

        {/* Real Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Real Price (in ₹)</label>
          <input
            value={realPrice}
            onChange={(e) => setRealPrice(parseFloat(e.target.value))}
            name="realPrice"
            type="number"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Discounted Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Discounted Price (in ₹)</label>
          <input
            value={discountPrice}
            onChange={(e) => setDiscountPrice(parseFloat(e.target.value))}
            name="discountPrice"
            type="number"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Available Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Available Sizes</label>
          <div className="mt-2 flex flex-wrap gap-4">
            {["xs", "s", "m", "l", "xl", "xxl"].map((size) => (
              <label key={size} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="availableSizes"
                  value={size}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAvailableSizes((prev) => [...prev, size])
                    } else {
                      setAvailableSizes((prev) => prev.filter((s) => s !== size))
                    }
                  }}
                  className="form-checkbox"
                />
                <span className="ml-2 uppercase">{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Available Fabrics */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Available Fabrics</label>
          <div className="mt-2 flex flex-wrap gap-4">
            {["polyester", "cotton", "polycotton", "dotKnit"].map((fabric) => (
              <label key={fabric} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="availableFabrics"
                  value={fabric}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAvailableFabrics((prev) => [...prev, fabric])
                    } else {
                      setAvailableFabrics((prev) => prev.filter((f) => f !== fabric))
                    }
                  }}
                  className="form-checkbox"
                />
                <span className="ml-2 capitalize">{fabric}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Uploader Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Images</label>
          {/* Preview selected images */}
          <div className="flex flex-wrap gap-2 mb-2">
            {imageFiles.map((file, index) => (
              <div key={index} className="w-20 h-20 border rounded overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddImageClick}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Image
          </button>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
          disabled={isUploading}
        >
          {isUploading ? "Uploading Images..." : "Create Product"}
        </button>
      </form>
    </div>
  )
}
