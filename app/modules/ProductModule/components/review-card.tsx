import { Star } from "lucide-react"
import { formatDatee } from "~/lib/utils"

interface ReviewCardProps {
  review: {
    title: string
    content: string
    rating: number
    customerId: string
    customerName: string
    createdAt?: string
  }
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`h-4 w-4 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />,
      )
    }
    return stars
  }

  return (
    <div className="border-b border-gray-100 py-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium">
            {review.customerName.charAt(0)}
          </div>
          <span className="font-medium">{review.customerName}</span>
        </div>
        {review.createdAt && <span className="text-sm text-gray-500">{formatDatee(new Date(review.createdAt))}</span>}
      </div>

      <div className="flex items-center mb-3">
        <div className="flex mr-2">{renderStars(review.rating)}</div>
        <span className="text-sm text-gray-600">({review.rating}/5)</span>
      </div>

      <h4 className="font-semibold mb-2">{review.title}</h4>
      <p className="text-gray-600">{review.content}</p>
    </div>
  )
}
