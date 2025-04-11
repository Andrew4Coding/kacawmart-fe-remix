import { Star } from "lucide-react"
import { Progress } from "~/components/ui/progress"

interface RatingSummaryProps {
  productRating: number
  ratingCount: number
  ratingDistribution?: {
    [key: number]: number
  }
}

export default function RatingSummary({ productRating, ratingCount, ratingDistribution = {} }: RatingSummaryProps) {
  // Default distribution if not provided
  const distribution = ratingDistribution || {
    5: Math.floor(ratingCount * 0.5),
    4: Math.floor(ratingCount * 0.3),
    3: Math.floor(ratingCount * 0.1),
    2: Math.floor(ratingCount * 0.05),
    1: Math.floor(ratingCount * 0.05),
  }

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

  // Calculate percentage for each rating
  const getPercentage = (count: number) => {
    return ratingCount > 0 ? Math.round((count / ratingCount) * 100) : 0
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold mb-1">{productRating.toFixed(1)}</div>
          <div className="flex mb-1">{renderStars(productRating)}</div>
          <div className="text-sm text-gray-500">{ratingCount} reviews</div>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center mb-2">
              <div className="w-12 text-sm text-gray-600">{star} stars</div>
              <div className="flex-1 mx-3">
                <Progress value={getPercentage(distribution[star] || 0)} className="h-2" />
              </div>
              <div className="w-10 text-sm text-gray-600 text-right">{getPercentage(distribution[star] || 0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
