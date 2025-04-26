// Handles page navigation for product listings

"use client";

import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("ellipsis-start");
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2">
      {pageNumbers.map((page, index) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return <span key={`ellipsis-${index}`}>...</span>;
        }

        const pageNum = page as number;
        return (
          <Button
            key={pageNum}
            variant="outline"
            className={cn(
              currentPage === pageNum
                ? "bg-black text-white hover:bg-gray-800"
                : "",
            )}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        );
      })}

      {currentPage < totalPages && (
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => onPageChange(currentPage + 1)}
        >
          NEXT <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
