"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function JobPagination({ currentPage, totalPages }: JobPaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `/jobs?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      <Link href={createPageUrl(Math.max(1, currentPage - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}>
        <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-2 border-border shadow-sm">
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous Page</span>
        </Button>
      </Link>

      <div className="flex items-center space-x-2">
        {getPageNumbers().map((page, i) => (
          page === "..." ? (
            <div key={`ellipsis-${i}`} className="h-12 w-12 flex items-center justify-center font-bold text-muted-foreground">
              <MoreHorizontal className="h-5 w-5" />
            </div>
          ) : (
            <Link key={page} href={createPageUrl(page)}>
              <Button
                variant={currentPage === page ? "default" : "outline"}
                className={`h-12 w-12 rounded-2xl font-bold shadow-sm transition-all ${
                  currentPage === page 
                    ? "bg-primary text-white border-primary shadow-md hover-lift" 
                    : "border-2 border-border bg-white text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {page}
              </Button>
            </Link>
          )
        ))}
      </div>

      <Link href={createPageUrl(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}>
        <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-2 border-border shadow-sm">
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next Page</span>
        </Button>
      </Link>
    </div>
  );
}
