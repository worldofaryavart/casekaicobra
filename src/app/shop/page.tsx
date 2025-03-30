import { db } from "@/db";
import Shop from "@/components/Shop";

// Define a type for Category
type Category = {
  id: string;
  name: string;
};

// Define the type for the product as returned by the database,
// allowing category to be null.
type DBProduct = {
  id: string;
  title: string;
  description: string;
  details: string;
  category: Category | null;  // Allow null if not connected
  realPrice: number;
  discountPrice: number;
  images: string[];
  availableSizes: string[];
  availableFabrics: string[];
  availableColors: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Define the type you want to use in your component
type Product = {
  id: string;
  title: string;
  description: string;
  realPrice: number;
  discountPrice: number;
  image: string;
  category: string;
};

export default async function ShopPage() {
  try {
    // Fetch categories (returns array of Category objects)
    const categories: Category[] = await db.category.findMany();

    // Fetch products including the related category
    const products: DBProduct[] = await db.product.findMany({
      include: { category: true },
    });

    // Transform the DB product data to your front‑end Product type
    const formattedProducts: Product[] = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      realPrice: product.realPrice,
      discountPrice: product.discountPrice,
      image: product.images[0], // use the first image as preview
      // If category is null, fallback to "Uncategorized"
      category: product.category ? product.category.name : "Uncategorized",
    }));

    return <Shop products={formattedProducts} categories={categories} />;
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div>
        <p>Error loading products. Please try again later.</p>
      </div>
    );
  }
}
