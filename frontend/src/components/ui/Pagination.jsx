import * as React from "react";
import { cn } from "../../lib/utils";

export function Pagination({ totalPages, currentPage, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "px-3 py-1 rounded-md border",
            page === currentPage
              ? "bg-black text-white border-black"
              : "bg-white text-black border-gray-300"
          )}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
