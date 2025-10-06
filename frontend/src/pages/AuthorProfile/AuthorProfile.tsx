import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Book, Calendar, Mail, ArrowLeft, Download, Eye, Share2 } from "lucide-react";

interface AuthorType {
  id: number;
  name: string;
  bio: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface BookType {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  publishedYear: number;
  pdf: string;
  createdAt: string;
}

const AuthorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<AuthorType | null>(null);
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [booksPage, setBooksPage] = useState(1);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch author details
  const fetchAuthor = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3000/authors/${id}`);
      const data = await response.json();

      if (data) {
        setAuthor(data);
      } else {
        setError('Author not found');
      }
    } catch (err) {
      setError('Failed to load author profile');
      console.error('Error fetching author:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch author's books
  const fetchAuthorBooks = async (page: number, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingBooks(true);
      }
      
      const response = await fetch(
        `http://localhost:3000/bookclub/booksbyauthor?author=${id}&page=${page}&limit=100`
      );
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        if (isLoadMore) {
          setBooks(prev => [...prev, ...data.data]);
        } else {
          setBooks(data.data);
        }
        
        setHasMoreBooks(data.page < data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching author books:', err);
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAuthor();
      fetchAuthorBooks(1);
    }
  }, [id]);

  const handleLoadMoreBooks = () => {
    const nextPage = booksPage + 1;
    setBooksPage(nextPage);
    fetchAuthorBooks(nextPage, true);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="lg:w-2/3">
                <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Author Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The author you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate('/authors')}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Authors</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/author')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Authors</span>
          </button>

          {/* Author Header */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Author Image */}
            <div className="lg:w-1/3">
              <div className="relative">
                <img
                  src={getImageUrl(author.image)}
                  alt={author.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>

            {/* Author Info */}
            <div className="lg:w-2/3">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{author.name}</h1>
              
              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <Book className="w-5 h-5" />
                  <span className="font-medium">{books.length}+ Published Books</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Joined {formatDate(author.createdAt)}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">About the Author</h3>
                <p className="text-gray-700 leading-relaxed">
                  {author.bio || "No biography available for this author."}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{books.length}</div>
                  <div className="text-sm text-gray-600">Books</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {new Date(author.createdAt).getFullYear()}
                  </div>
                  <div className="text-sm text-gray-600">Joined</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {Math.ceil((new Date().getTime() - new Date(author.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30))}
                  </div>
                  <div className="text-sm text-gray-600">Months Active</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {books.filter(book => book.publishedYear === new Date().getFullYear()).length}
                  </div>
                  <div className="text-sm text-gray-600">This Year</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Books Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Books by {author.name}
          </h2>
          <p className="text-gray-600">
            Explore the literary works and publications from this talented author
          </p>
        </div>

        {books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200"
                >
                  {/* Book Cover */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
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

                  {/* Book Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {book.description || "No description available."}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        {book.publishedYear || 'Unknown Year'}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Book className="w-4 h-4" />
                        <span>PDF</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Books Button */}
            {hasMoreBooks && (
              <div className="text-center">
                <button
                  onClick={handleLoadMoreBooks}
                  disabled={loadingBooks}
                  className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                >
                  {loadingBooks ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading More Books...</span>
                    </>
                  ) : (
                    <span>Load More Books</span>
                  )}
                </button>
              </div>
            )}

            {!hasMoreBooks && books.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2 text-gray-600 bg-white rounded-lg px-6 py-4 border border-gray-200">
                  <Book className="w-5 h-5" />
                  <span>All {books.length} books by {author.name} loaded</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Books Published Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {author.name} hasn't published any books in our library yet. Check back later for new releases.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;