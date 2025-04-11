import type { LoaderFunctionArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { ArrowLeft } from "lucide-react"
import { Button } from "~/components/ui/button"
import fetchServer from "~/lib/fetch"
import ReviewsModule from "~/modules/ProductModule/review"

export async function loader(args: LoaderFunctionArgs) {
  const productId = args.params.id

  if (!productId) {
    throw new Error("Product ID is required")
  }

  // Fetch product basic info for the header
  // dah bener ini
  const productData = await fetchServer(args.request, `/api/product/details/${productId}`)

  // Fetch complete reviews data
  // dah bener
  const reviewsData = await fetchServer(args.request, `/api/product/${productId}/reviews`)
  
  
  // dah aman kok ini returnannyaa
  return {
    product: {
      id: productId,
      name: productData.product.name,
    },
    reviews: reviewsData.reviews || [],
    ratingCount: reviewsData.ratingCount || 0,
    productRating: reviewsData.productRating || 0,
  }
}

export default function ProductReviewsPage() {
  const data = useLoaderData<typeof loader>()
  console.log("masuk sini kagak si")
  return (
    // <div className="min-h-screen bg-[#f0faf5] p-20 pt-40">
    //   <div className="max-w-4xl mx-auto">
    //     <div className="mb-6">
    //       <div className="flex justify-between items-center">
    //         <div>
    //           <h1 className="text-3xl font-bold mb-2">{data.product.name} - Reviews</h1>
    //           <div className="text-gray-600">
    //             <Link to="/" className="hover:underline">
    //               Home
    //             </Link>{" "}
    //             {" > "}
    //             <Link to="/products" className="hover:underline">
    //               All Products
    //             </Link>{" "}
    //             {" > "}
    //             <Link to={`/products/${data.product.id}`} className="hover:underline">
    //               {data.product.name}
    //             </Link>{" "}
    //             {" > "}
    //             <span>Reviews</span>
    //           </div>
    //         </div>
    //         <Link to={`/products/${data.product.id}`}>
    //           <Button className="bg-emerald-500 hover:bg-emerald-600">
    //             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Product
    //           </Button>
    //         </Link>
    //       </div>
    //     </div>

        <ReviewsModule
          productId={data.product.id}
          productRating={data.productRating}
          ratingCount={data.ratingCount}
          reviews={data.reviews}
        />
    //   </div>
    // </div>
  )
}
