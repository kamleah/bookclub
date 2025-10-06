import React, { useState, useEffect } from "react";
import { User, Book, Calendar, Mail, Search, Filter, Grid, List, ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthorType {
  id: number;
  name: string;
  bio: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    books: number;
  };
}

const AuthorList: React.FC = () => {
  const [authors, setAuthors] = useState<AuthorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const navigate = useNavigate();

  // Fetch authors with filters
  const fetchAuthors = async (pageNum: number, isLoadMore = false, filters: any = {}) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
        ...filters
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (sortBy) {
        params.append('sort', sortBy);
      }

      const response = await fetch(`http://localhost:3000/authors?${params}`);
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        if (isLoadMore) {
          setAuthors(prev => [...prev, ...data.data]);
        } else {
          setAuthors(data.data);
        }
        
        setHasMore(data.page < data.totalPages);
      } else {
        setError('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to load authors. Please try again later.');
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAuthors(1);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 2 || searchTerm.length === 0) {
        setPage(1);
        fetchAuthors(1, false, { search: searchTerm });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Apply sort when it changes
  useEffect(() => {
    setPage(1);
    fetchAuthors(1, false, { sort: sortBy });
  }, [sortBy]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const filters: any = {};
    
    if (sortBy) filters.sort = sortBy;
    if (searchTerm) filters.search = searchTerm;
    
    fetchAuthors(nextPage, true, filters);
  };

  const clearFilters = () => {
    setSortBy('newest');
    setSearchTerm('');
    setPage(1);
    fetchAuthors(1);
  };

  const getImageUrl = (image: string) => {
    if (!image) {
      return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
    }
    
    if (image.startsWith('http')) {
      return image;
    }
    
    return `http://localhost:3000${image}`;
  };

  const handleAuthorClick = (author: AuthorType) => {
    navigate(`/author/${author.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasActiveFilters = sortBy !== 'newest' || searchTerm;

  if (loading && authors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-12 bg-gray-200 rounded-lg w-64 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-72 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-5 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Authors Collection</h1>
              <p className="text-gray-600">Discover talented authors and explore their literary works</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          {/*  */}

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Clear all</span>
                </button>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-900 text-white">
                      Search: {searchTerm}
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-2 hover:bg-gray-800 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 mb-2">{error}</p>
            <button
              onClick={() => fetchAuthors(1)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {authors.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{authors.length}</span> authors
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {authors.map((author) => (
                  <div
                    key={author.id}
                    onClick={() => handleAuthorClick(author)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200 cursor-pointer"
                  >
                    <div className="relative h-72 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                      <img
                        src={getImageUrl(author.image)}
                        alt={author.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <button className="w-full bg-white text-gray-900 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {author.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {author.bio || "No biography available."}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Book className="w-4 h-4" />
                          <span>{author._count?.books || 0} books</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(author.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-12">
                {authors.map((author) => (
                  <div
                    key={author.id}
                    onClick={() => handleAuthorClick(author)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer"
                  >
                    <div className="flex">
                      <div className="w-48 h-48 flex-shrink-0 bg-gradient-to-br from-blue-50 to-purple-50">
                        <img
                          src={getImageUrl(author.image)}
                          alt={author.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
                          }}
                        />
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-xl mb-2">
                            {author.name}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {author.bio || "No biography available."}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Book className="w-4 h-4" />
                              <span>{author._count?.books || 0} Published Books</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>Joined {formatDate(author.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                            View Author Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More Authors</span>
                  )}
                </button>
              </div>
            )}

            {!hasMore && authors.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span>All {authors.length} authors loaded</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {hasActiveFilters ? 'No authors match your filters' : 'No authors available'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters or search terms'
                : 'The authors list is currently empty. Please check back later.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorList;