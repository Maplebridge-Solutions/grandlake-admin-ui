"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 12,
  pageSize = 50,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-surface-subtle",
        className,
      )}
    >
      {/* Page size */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-content-muted">Show per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="bg-surface-page border border-surface-subtle rounded-lg px-2 py-1 text-sm font-bold outline-none"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Page numbers */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-lg border-surface-subtle"
          disabled={currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
        >
          {"<"}
        </Button>

        {getPages().map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="text-content-muted px-1 text-sm">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(page as number)}
              className={cn(
                "w-8 h-8 rounded-lg",
                page === currentPage
                  ? "bg-brand text-white border-brand shadow-md shadow-brand/10"
                  : "border-surface-subtle",
              )}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-lg border-surface-subtle"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          {">"}
        </Button>
      </div>
    </div>
  );
}
