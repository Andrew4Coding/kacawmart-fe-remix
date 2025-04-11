"use client"

import { Link, useParams } from "@remix-run/react"
import type { Product, Review } from "~/lib/types"
import ProductReviewsSection from "../components/product-reviews-section"


interface ProductDetailModuleProps {
  product: Product
  reviews?: Review[]
  ratingCount?: number
  productRating?: number
}

export default function ProductDetailModule({
  product,
  reviews = [],
  ratingCount = 0,
  productRating = 0,
}: ProductDetailModuleProps) {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-[#f0faf5] p-20 pt-40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Product Details</h1>
          <div className="text-gray-600">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            {" > "}
            <Link to="/products" className="hover:underline">
              All Products
            </Link>{" "}
            {" > "}
            <span>Product Details</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Name</h2>
                <p className="text-gray-700">{product.name}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Category</h2>
                <p className="text-gray-700">
                  {product.category[0].name || "Uncategorized"} {/* TODO: FIX THIS */}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Price</h2>
                <p className="text-gray-700">₹{(product.price / 100).toFixed(2)}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Stock</h2>
                <p className="text-gray-700">{product.stock}</p>
              </div>
            </div>

            {/* Right column - Images */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Product Image</h2>
              <div className="grid grid-cols-2 gap-4">
                <img src={product.imageUrl || "/placeholder.svg"} alt="Product Image" className="rounded-lg shadow" />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link to={`/products/${id}/edit`}>
              <button className="border border-emerald-500 hover:bg-emerald-600 hover:text-white text-emerald-500 px-4 py-2 rounded">
                Edit Details
              </button>
            </Link>
            <Link to="/products">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">
                Back to Products
              </button>
            </Link>
          </div>
        </div>

        {/* Reviews section integrated directly into the component */}
        <ProductReviewsSection
          productId={product.id}
          productRating={productRating}
          ratingCount={ratingCount}
          reviews={reviews}
          maxReviews={3}
        />
      </div>
    </div>
  )
}
