import React, { useState, useEffect } from "react";
import { Book, User, Calendar, Download, Eye, Search, Filter, Grid, List } from "lucide-react";

interface BookType {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  publishedYear: number;
  author: {
    id: number;
    name: string;
    image: string;
  };
  pdf: string;
  createdAt: string;
}

const Ebook: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBooks = async (pageNum: number, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      const response = await fetch(
        `http://localhost:3000/books?page=${pageNum}&limit=10`
      );
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        if (isLoadMore) {
          setBooks(prev => [...prev, ...data.data]);
        } else {
          setBooks(data.data);
        }
        
        setHasMore(data.page < data.totalPages);
      } else {
        setError('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to load books. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBooks(nextPage, true);
  };

  const getImageUrl = (coverImage: string) => {
    if (!coverImage) {
      return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop";
    }
    
    if (coverImage.startsWith('http')) {
      return coverImage;
    }
    
    return `http://localhost:3000${coverImage}`;
  };

  const handleViewBook = (book: BookType) => {
    if (book.pdf) {
      const pdfUrl = book.pdf.startsWith('http') ? book.pdf : `http://localhost:3000${book.pdf}`;
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownloadBook = (book: BookType) => {
    if (book.pdf) {
      const pdfUrl = book.pdf.startsWith('http') ? book.pdf : `http://localhost:3000${book.pdf}`;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${book.title}.pdf`;
      link.click();
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && books.length === 0) {
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Books Club</h1>
              <p className="text-gray-600">Discover and explore our curated collection of ebooks</p>
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
          {/* <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              />
            </div>
            <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 mb-2">{error}</p>
            <button
              onClick={() => fetchBooks(1)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {filteredBooks.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredBooks.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{books.length}</span> books
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200"
                  >
                    <div className="relative h-72 overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(book.coverImage)}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                          <button
                            onClick={() => handleViewBook(book)}
                            className="flex-1 bg-white text-gray-900 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Read</span>
                          </button>
                          <button
                            onClick={() => handleDownloadBook(book)}
                            className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {book.description || "No description available."}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                            {book.author.image ? (
                              <img
                                src={getImageUrl(book.author.image)}
                                alt={book.author.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <User className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{book.author.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{book.publishedYear || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-12">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200"
                  >
                    <div className="flex">
                      <div className="w-48 h-48 flex-shrink-0 bg-gray-100">
                        <img
                          src={getImageUrl(book.coverImage)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop";
                          }}
                        />
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-xl mb-2">
                            {book.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {book.description || "No description available."}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{book.author.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{book.publishedYear || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Book className="w-4 h-4" />
                              <span>PDF</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <button
                            onClick={() => handleViewBook(book)}
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center space-x-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Read Now</span>
                          </button>
                          <button
                            onClick={() => handleDownloadBook(book)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center space-x-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
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
                    <span>Load More</span>
                  )}
                </button>
              </div>
            )}

            {!hasMore && books.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2 text-gray-600">
                  <Book className="w-5 h-5" />
                  <span>All {books.length} books loaded</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No books found' : 'No books available'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? 'Try adjusting your search terms or filters'
                : 'The library is currently empty. Please check back later.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ebook;