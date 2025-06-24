import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  canGoNext,
  canGoPrevious,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center mt-8">
      <Pagination className="bg-white rounded-2xl shadow-soft border border-expo-gray-200 p-2">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (canGoPrevious) onPageChange(currentPage - 1);
              }}
              className={cn(
                "rounded-xl transition-all duration-200",
                !canGoPrevious 
                  ? "pointer-events-none opacity-50" 
                  : "hover:bg-expo-accent hover:text-white"
              )}
            />
          </PaginationItem>

          {visiblePages.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis className="text-expo-gray-400" />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page as number);
                  }}
                  className={cn(
                    "rounded-xl transition-all duration-200 min-w-[40px] h-10",
                    currentPage === page
                      ? "bg-expo-accent text-white shadow-medium"
                      : "hover:bg-expo-gray-100 text-expo-gray-600"
                  )}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (canGoNext) onPageChange(currentPage + 1);
              }}
              className={cn(
                "rounded-xl transition-all duration-200",
                !canGoNext 
                  ? "pointer-events-none opacity-50" 
                  : "hover:bg-expo-accent hover:text-white"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
