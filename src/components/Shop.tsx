import Link from "next/link";

type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  realPrice: number;
  discountPrice: number;
};

type Category = {
  id: string;
  name: string;
};

export default function Shop({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  return (
    <div className="min-h-screen w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-black mb-8">
          Shop Printed T-Shirts
        </h1>
        {categories.map((cat) => {
          const filteredProducts = products.filter(
            (prod) => prod.category === cat.name
          );
          return (
            <section key={cat.id} className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-4">
                {cat.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product: Product) => (
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
