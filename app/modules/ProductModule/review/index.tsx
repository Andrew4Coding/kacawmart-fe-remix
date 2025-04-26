"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ReviewCard from "../components/review-card";
import RatingSummary from "../components/rating-summary";

interface Review {
  title: string;
  content: string;
  rating: number;
  customerId: string;
  customerName: string;
  createdAt?: string;
}

interface ReviewsModuleProps {
  productId: string;
  productRating: number;
  ratingCount: number;
  reviews: Review[];
}

export default function ReviewsModule({
  productId,
  productRating,
  ratingCount,
  reviews,
}: ReviewsModuleProps) {
  const [sortOption, setSortOption] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [displayedReviews, setDisplayedReviews] = useState(reviews);

  // Calculate rating distribution
  const ratingDistribution = reviews.reduce(
    (acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    },
    {} as { [key: number]: number },
  );

  // Handle sorting and filtering
  const handleSortChange = (value: string) => {
    setSortOption(value);
    sortAndFilterReviews(value, filterRating);
  };

  const handleFilterChange = (value: string) => {
    setFilterRating(value);
    sortAndFilterReviews(sortOption, value);
  };

  const sortAndFilterReviews = (sort: string, filter: string) => {
    let filtered = [...reviews];

    // Apply filter
    if (filter !== "all") {
      const ratingFilter = Number.parseInt(filter);
      filtered = filtered.filter((review) => review.rating === ratingFilter);
    }

    // Apply sort
    switch (sort) {
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "newest":
      default:
        // Assuming reviews have createdAt, otherwise keep original order
        if (filtered[0]?.createdAt) {
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime(),
          );
        }
        break;
    }

    setDisplayedReviews(filtered);
  };

  return (
    <div className="space-y-6">
      <RatingSummary
        productRating={productRating}
        ratingCount={ratingCount}
        ratingDistribution={ratingDistribution}
      />

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h3 className="text-lg font-semibold mb-2 sm:mb-0">
            Customer Reviews ({reviews.length})
          </h3>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Filter:</span>
              <Select value={filterRating} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort:</span>
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="highest">Highest Rating</SelectItem>
                  <SelectItem value="lowest">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {displayedReviews.length > 0 ? (
          <div className="space-y-0 divide-y divide-gray-100">
            {displayedReviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No reviews match your filter criteria
          </div>
        )}

        {displayedReviews.length > 5 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="border-emerald-500 text-emerald-500 hover:bg-emerald-50"
            >
              Load More Reviews
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
