import React, { ReactNode, useState } from "react";
import {
  Pencil,
  Trash2,
  Eye,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

interface Header {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, row: CardItem) => ReactNode;
}

interface CardItem {
  id: number;
  [key: string]: any;
}

interface BCTableProps {
  headers: Header[];
  data: CardItem[];
  onEdit?: (item: CardItem) => void;
  onDelete?: (id: number) => void;
  onView?: (item: CardItem) => void;
  showEditIcon?: boolean;
  showDeleteIcon?: boolean;
  showViewIcon?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
  
  // Pagination props
  showPagination?: boolean;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  
  // External pagination control
  externalPagination?: boolean;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const BCTable: React.FC<BCTableProps> = ({
  headers = [],
  data = [],
  onEdit,
  onDelete,
  onView,
  showEditIcon = true,
  showDeleteIcon = true,
  showViewIcon = false,
  isLoading = false,
  emptyMessage = "No data available",
  showPagination = true,
  itemsPerPageOptions = [5, 10, 20, 50],
  defaultItemsPerPage = 5,
  
  // External pagination
  externalPagination = false,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 5,
  onPageChange,
  onItemsPerPageChange,
}) => {
  // Internal pagination state (only used when externalPagination is false)
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(defaultItemsPerPage);

  // Use external or internal pagination based on prop
  const actualCurrentPage = externalPagination ? currentPage : internalCurrentPage;
  const actualItemsPerPage = externalPagination ? itemsPerPage : internalItemsPerPage;
  const actualTotalItems = externalPagination ? totalItems : data.length;
  
  const totalPages = Math.ceil(actualTotalItems / actualItemsPerPage);
  
  // For internal pagination, slice the data
  const currentData = externalPagination 
    ? data 
    : data.slice(
        (actualCurrentPage - 1) * actualItemsPerPage,
        actualCurrentPage * actualItemsPerPage
      );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (externalPagination && onPageChange) {
        onPageChange(page);
      } else {
        setInternalCurrentPage(page);
      }
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    if (externalPagination && onItemsPerPageChange) {
      onItemsPerPageChange(value);
    } else {
      setInternalItemsPerPage(value);
      setInternalCurrentPage(1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (actualCurrentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, actualCurrentPage - 1);
        i <= Math.min(totalPages - 1, actualCurrentPage + 1);
        i++
      )
        pages.push(i);
      if (actualCurrentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-5 bg-gray-200 rounded-md"></div>
        ))}
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          {/* Header */}
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide ${header.className || ""
                    }`}
                >
                  {header.label}
                </th>
              ))}
              {(showEditIcon || showDeleteIcon || showViewIcon) && (
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Rows */}
          <tbody className="divide-y divide-gray-100">
            {currentData.map((item, idx) => (
              <tr
                key={item.id}
                className={`transition-colors duration-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
              >
                {headers.map((header) => (
                  <td
                    key={header.key}
                    className={`px-6 py-4 text-sm text-gray-700 ${header.className || ""
                      }`}
                  >
                    {header.render
                      ? header.render(item[header.key], item)
                      : item[header.key]}
                  </td>
                ))}

                {(showEditIcon || showDeleteIcon || showViewIcon) && (
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {showViewIcon && onView && (
                        <button
                          onClick={() => onView(item)}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          aria-label="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                      {showEditIcon && onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          aria-label="Edit"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                      )}
                      {showDeleteIcon && onDelete && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={actualItemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span>of {actualTotalItems} results</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(1)}
              disabled={actualCurrentPage === 1}
              className="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => goToPage(actualCurrentPage - 1)}
              disabled={actualCurrentPage === 1}
              className="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((page, idx) => (
              <button
                key={idx}
                onClick={() => typeof page === "number" && goToPage(page)}
                disabled={page === "..."}
                className={`min-w-[36px] h-9 rounded-lg border text-sm font-medium transition-colors ${page === actualCurrentPage
                  ? "bg-gray-800 text-white border-gray-800"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(actualCurrentPage + 1)}
              disabled={actualCurrentPage === totalPages}
              className="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={actualCurrentPage === totalPages}
              className="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BCTable;