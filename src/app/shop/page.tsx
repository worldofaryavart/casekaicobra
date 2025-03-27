import Link from "next/link";
import { Star } from "lucide-react";

type Product = {
  id: number;
  title: string;
  description: string;
  rating: number;
  realPrice: number;
  discountPrice: number;
  image: string;
  category: string;
};

const dummyProducts: Product[] = [
  {
    id: 1,
    title: "Printed T-Shirt",
    description: "A cool printed t-shirt for your everyday look.",
    rating: 4.5,
    realPrice: 1999,
    discountPrice: 1499,
    image: "/teedesigns/kathakali_mask.png",
    category: "This Week Collection",
  },
  {
    id: 2,
    title: "Printed T-Shirt",
    description: "Stand out with this trendy printed tee.",
    rating: 4.0,
    realPrice: 2199,
    discountPrice: 1699,
    image: "/teedesigns/assam_bihu.png",
    category: "This Week Collection",
  },
  {
    id: 3,
    title: "Printed T-Shirt",
    description: "Stand out with this trendy printed warli tee.",
    rating: 4.0,
    realPrice: 2199,
    discountPrice: 1699,
    image: "/teedesigns/warli_tribal_art.png",
    category: "This Week Collection",
  },
  {
    id: 4,
    title: "Printed T-Shirt",
    description: "Perfect for the festival season, grab yours now!",
    rating: 4.8,
    realPrice: 2499,
    discountPrice: 1899,
    image: "/teedesigns/gond_motif_art.png",
    category: "Festival Special",
  },
  {
    id: 5,
    title: "Printed T-Shirt",
    description: "Get ready for summer with this vibrant printed tee.",
    rating: 4.2,
    realPrice: 2799,
    discountPrice: 1999,
    image: "/teedesigns/kalamkari_inspired_prints.png",
    category: "Summer Special",
  },
  {
    id: 6,
    title: "Printed T-Shirt",
    description: "A versatile printed t-shirt for any occasion.",
    rating: 4.3,
    realPrice: 2299,
    discountPrice: 1799,
    image: "/teedesigns/madhubani_art_illstrations.png",
    category: "Festival Special",
  },
  {
    id: 7,
    title: "Printed T-Shirt",
    description: "Light, airy, and perfect for summer days.",
    rating: 4.6,
    realPrice: 2599,
    discountPrice: 2099,
    image: "/teedesigns/madurai_sungudi_pattern.png",
    category: "Summer Special",
  },
  {
    id: 8,
    title: "Printed T-Shirt",
    description: "Light, airy, and perfect for summer days.",
    rating: 4.6,
    realPrice: 2599,
    discountPrice: 2099,
    image: "/teedesigns/pulkari_embroidery_motifs.png",
    category: "Summer Special",
  },
  {
    id: 8,
    title: "Printed T-Shirt",
    description: "Light, airy, and perfect for summer days.",
    rating: 4.6,
    realPrice: 2599,
    discountPrice: 2099,
    image: "/teedesigns/pattchitra_inspired_design.png",
    category: "Festival Special",
  },
  
];

const categories = [
  "This Week Collection",
  "Festival Special",
  "Summer Special",
];

export default function ShopPage() {
  return (
    <div className="min-h-screen w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-black mb-8">
          Shop Printed T-Shirts
        </h1>
        {categories.map((cat) => {
          const filteredProducts = dummyProducts.filter(
            (prod) => prod.category === cat
          );
          return (
            <section key={cat} className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-4">
                {cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/shop/product/${product.id}`}>
                    <div className="border rounded-lg shadow-sm p-4 flex flex-col hover:shadow-md transition">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="mb-4 rounded"
                      />
                      <h3 className="text-xl font-bold text-black mb-2">
                        {product.title}
                      </h3>
                      <p className="text-black mb-2">{product.description}</p>
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="ml-1 text-black">{product.rating}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-500 line-through mr-2">
                          ₹{product.realPrice}
                        </span>
                        <span className="font-bold text-black">
                          ₹{product.discountPrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
