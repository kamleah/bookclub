import React, { useState, useEffect, useCallback } from "react";
import { Book, Search, User, X } from "lucide-react";

export interface BookType {
  id: number;
  title: string;
  author: string;
  category: string;
  type?: 'book' | 'author';
  description?: string;
  coverImage?: string;
  publishedYear?: number;
}

interface BookSearchProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  searchPlaceholder?: string;
  onSelect?: (book: BookType) => void;
}

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const BookSearch: React.FC<BookSearchProps> = ({
  isOpen,
  onClose,
  title = "Search Books & Authors",
  searchPlaceholder = "Search for books or authors...",
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "book" | "author">("all");
  const [searchResults, setSearchResults] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Search function
  const performSearch = useCallback(async (query: string, type: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/bookclub/search?q=${encodeURIComponent(query)}&type=${type}&limit=20`
      );
      
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      } else {
        setError(data.message);
        setSearchResults([]);
      }
    } catch (err) {
      setError('Failed to connect to search service.');
      setSearchResults([]);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      performSearch(debouncedSearchQuery, searchType);
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [debouncedSearchQuery, searchType, performSearch]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const getImageUrl = (coverImage: string | undefined) => {
    if (!coverImage) return null;
    if (coverImage.startsWith('http')) return coverImage;
    return `http://localhost:3000${coverImage}`;
  };

  const displayResults = searchQuery ? searchResults : [];

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-50 transition-transform duration-500 ease-in-out overflow-hidden ${
        isOpen ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-700">{title}</h2>
            <button
              onClick={() => {
                setSearchQuery("");
                onClose();
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 pl-12 pr-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-amber-600 shadow-sm transition-all"
                autoFocus
              />
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-3 mt-4">
              {["all", "book", "author"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type as "all" | "book" | "author")}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                    searchType === type
                      ? "bg-amber-700 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type === "all" ? "All" : type === "book" ? "Books" : "Authors"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="max-w-4xl mx-auto px-6 space-y-4">
            {searchQuery === "" ? (
              <div className="text-center py-16">
                <Book className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Start typing to search for books or authors</p>
              </div>
            ) : loading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">Searching...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <Book className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-red-500 text-lg mb-2">Search unavailable</p>
                <p className="text-sm text-gray-400">{error}</p>
              </div>
            ) : displayResults.length > 0 ? (
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">
                  Found {displayResults.length} result{displayResults.length !== 1 && "s"}
                  {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
                </p>
                {displayResults.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
                    onClick={() => onSelect?.(item)}
                  >
                    <div className="w-14 h-20 flex items-center justify-center flex-shrink-0 rounded-lg bg-amber-50">
                      {item.coverImage ? (
                        <img 
                          src={getImageUrl(item.coverImage) || ''} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center rounded-lg ${item.coverImage ? 'hidden' : 'flex'}`}>
                        {item.type === 'author' ? (
                          <User className="w-6 h-6 text-amber-700" />
                        ) : (
                          <Book className="w-6 h-6 text-amber-700" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-lg">{item.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-600 text-sm">{item.author}</p>
                      </div>
                      {item.description && (
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <span className="inline-block mt-2 px-3 py-1 text-amber-700 bg-amber-50 rounded-full text-xs font-medium">
                        {item.type === 'author' ? 'Author' : item.category || 'Book'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Book className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-400 mt-2">Try searching with different keywords</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSearch;