import { db } from "@/db";
import Shop from "@/components/Shop";

// Define a type for the product as returned by the database
type DBProduct = {
  id: string;
  title: string;
  description: string;
  details: string;
  category: string;
  realPrice: number;
  discountPrice: number;
  images: string[];
  availableSizes: string[];
  availableFabrics: string[];
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

const categories = [
  "This Week Collection",
  "Festival Special",
  "Summer Special",
];

export default async function ShopPage() {
  try {
    // Type the result of the database query
    const products: DBProduct[] = await db.product.findMany();

    console.log("products are : ", products);

    // Transform the database results into the Product type
    const formattedProducts: Product[] = products.map((product: DBProduct) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      realPrice: product.realPrice,
      discountPrice: product.discountPrice,
      image: product.images[0],
      category: product.category,
    }));

    console.log("formattedProduct is : ", formattedProducts);

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
