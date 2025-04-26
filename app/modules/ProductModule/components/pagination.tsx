import { ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Add current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (pageNumbers[pageNumbers.length - 1] !== i - 1) {
        pageNumbers.push(-1); // Indicator for ellipsis
      }
      pageNumbers.push(i);
    }

    // Add last page if not already included
    if (totalPages > 1) {
      if (pageNumbers[pageNumbers.length - 1] !== totalPages - 1) {
        pageNumbers.push(-1); // Indicator for ellipsis
      }
      if (pageNumbers[pageNumbers.length - 1] !== totalPages) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {pageNumbers.map((pageNumber, index) =>
        pageNumber === -1 ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              currentPage === pageNumber
                ? "bg-gray-800 text-white"
                : "border text-gray-700"
            }`}
          >
            {pageNumber}
          </button>
        ),
      )}

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-1 border rounded"
        >
          NEXT
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
