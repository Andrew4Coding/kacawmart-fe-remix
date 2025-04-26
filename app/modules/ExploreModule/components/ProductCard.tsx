import { Link } from "@remix-run/react";
import { Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { formatPrice } from "~/lib/utils";
import { Product } from "../types";
import Image from "~/components/ui/image";

export function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`product/${product.id}`} className="block">
      <Card
        className="overflow-hidden transition-all duration-300 group h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden pt-[100%]">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
          />
          {product.stock < 100 && (
            <Badge className="absolute top-3 left-3 bg-amber-500 text-white hover:bg-amber-600">
              Low Stock
            </Badge>
          )}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <Button className="bg-white text-emerald-700 hover:bg-gray-100">
              View Details
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <Star
                className={`h-4 w-4 ${product.productRating >= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
              />
              <span className="text-sm font-medium ml-1">
                {product.productRating}
              </span>
            </div>
            <span className="text-xs text-gray-500 ml-2">
              ({product.ratingCount} reviews)
            </span>
            {product.category.length > 0 && (
              <Badge
                variant="outline"
                className="ml-auto text-xs border-gray-200 text-gray-600"
              >
                {product.category[0].name}
              </Badge>
            )}
          </div>
          <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 h-12">
            {product.name.replace(/!!/g, "")}
          </h3>
          <div className="mt-2 text-lg font-bold text-emerald-600">
            {formatPrice(product.price)}
          </div>
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            View Product
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
