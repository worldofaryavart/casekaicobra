// app/admin/new-product/page.tsx

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function NewProductPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  if (!user || user.email !== ADMIN_EMAIL) {
    return notFound();
  }

  // Note: This example assumes the form submission is handled server-side.
  // You can use a traditional HTML form that posts to an API route.
  return (
    <div className="p-8">
      <Link href="/admin">
        <a className="text-indigo-700 mb-4 inline-block">Back to Dashboard</a>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Add New Product</h1>
      <form action="/api/add-product" method="POST" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            name="title"
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (in ₹)
          </label>
          <input
            name="price"
            type="number"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            name="image"
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
