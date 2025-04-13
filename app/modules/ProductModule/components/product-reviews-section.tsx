import { Button } from "~/components/ui/button"
import { Link } from "@remix-run/react"
import ReviewCard from "./review-card"
import { Star } from "lucide-react"

interface Review {
  title: string
  content: string
  rating: number
  customerId: string
  customerName: string
  createdAt?: string
}

interface ProductReviewsSectionProps {
  productId: string
  productRating: number
  ratingCount: number
  reviews: Review[]
  maxReviews?: number
}

export default function ProductReviewsSection({
  productId,
  productRating,
  ratingCount,
  reviews,
  maxReviews = 3,
}: ProductReviewsSectionProps) {
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating - fullStars >= 0.5
    const stars = []

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-5 w-5 text-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </div>
          </div>,
        )
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />)
      }
    }
    return stars
  }

  // Display only a limited number of reviews
  const displayedReviews = reviews.slice(0, maxReviews)

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <div className="flex items-center mt-1">
            <div className="flex mr-2">{renderStars(productRating)}</div>
            <span className="text-sm text-gray-600">
              {productRating.toFixed(1)} out of 5 ({ratingCount} reviews)
            </span>
          </div>
        </div>
        <Link to={`/products/${productId}/reviews`}>
          <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-50">
            View All Reviews
          </Button>
        </Link>
      </div>

      {displayedReviews.length > 0 ? (
        <div className="space-y-0 divide-y divide-gray-100">
          {displayedReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No reviews yet.</div>
      )}

      {reviews.length > maxReviews && (
        <div className="mt-6 text-center">
          <Link to={`/products/${productId}/reviews`}>
            <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-50">
              See All {reviews.length} Reviews
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
