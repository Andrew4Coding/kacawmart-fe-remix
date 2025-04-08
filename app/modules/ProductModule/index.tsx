import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import ProductCard from "./components/card";
import Pagination from "./components/pagination";
import { Link } from "@remix-run/react";

export default function ProductModule() {
  return (
      <div className="min-h-screen pt-40 p-20 space-y-10">
          <div className="flex justify-between">
              <h1 className="font-libre font-bold text-2xl">
                  All Products
              </h1>
              <Link
                to={"/products/create"}
              >
                <Button>
                    <Plus />
                    Add New Product
                </Button>
              </Link>
          </div>
          <div className="mt-10 grid grid-cols-4 gap-4">
              {
                    Array.from({ length: 12 }, (_, index) => (
                        <ProductCard
                            product={
                                {
                                    id: `product-${index}`,
                                    name: `Product ${index + 1}`,
                                    category: `Category ${index % 3 + 1}`,
                                    price: parseFloat((Math.random() * 100).toFixed(2)),
                                    summary: `This is a summary of Product ${index + 1}.`,
                                    stats: {
                                        sales: Math.floor(Math.random() * 1000),
                                        rating: parseFloat((Math.random() * 5).toFixed(1)),
                                        remaining: Math.floor(Math.random() * 100),
                                    },
                                }
                            }
                        />
                    ))  
              }
          </div>
          <Pagination
              currentPage={1}
              totalPages={10}
              onPageChange={(page) => {
                  console.log(`Page changed to: ${page}`);
              }}
          />
    </div>
  );
}