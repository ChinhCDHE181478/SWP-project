"use client";
import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button 
        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        {"<<"}
      </button>
      <button 
        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {"<"}
      </button>
      
      {[...Array(totalPages)].map((_, index) => (
        <button 
          key={index + 1}
          className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-gray-300" : "hover:bg-gray-200"}`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button 
        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {">"}
      </button>
      <button 
        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;