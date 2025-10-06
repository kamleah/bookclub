import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface Book {
  id: number;
  title: string;
  author: {
    name: string;
  };
  coverImage: string;
  publishedYear?: number;
  rating?: number;
  price?: string;
}

const RecommendedBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendedBooks();
  }, []);

  const fetchRecommendedBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:3000/bookclub/recommended"
      );
      const data = await response.json();

      if (data.success) {
        // Add default rating and price for display
        const booksWithDefaults = data.data.map((book: Book) => ({
          ...book,
        }));
        setBooks(booksWithDefaults);
      } else {
        setError(data.message || "Failed to fetch recommended books");
      }
    } catch (err) {
      setError("Failed to load recommended books. Please try again later.");
      console.error("Error fetching recommended books:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fallback books if API fails
  const getFallbackBooks = (): Book[] => [
    {
      id: 1,
      title: "Emotional Intelligence",
      author: { name: "Danyel Goleman" },
      coverImage:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
      price: "$32",
      rating: 4.9,
    },
    {
      id: 2,
      title: "How to Talk to Anyone",
      author: { name: "Leil Lowndes" },
      coverImage:
        "https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop",
      price: "$32",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Who Moved My Cheese",
      author: { name: "Spencer Johnson" },
      coverImage:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop",
      price: "$32",
      rating: 4.9,
    },
    {
      id: 4,
      title: "The Psychology of Money",
      author: { name: "Morgan Housel" },
      coverImage:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=300&fit=crop",
      price: "$32",
      rating: 4.9,
    },
    {
      id: 5,
      title: "Atomic Habits",
      author: { name: "James Clear" },
      coverImage:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=300&fit=crop",
      price: "$32",
      rating: 4.9,
    },
    {
      id: 6,
      title: "Think and Grow Rich",
      author: { name: "Napoleon Hill" },
      coverImage:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
      price: "$32",
      rating: 4.9,
    },
  ];

  const getImageUrl = (coverImage: string) => {
    if (!coverImage) {
      return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop";
    }

    if (coverImage.startsWith("http")) {
      return coverImage;
    }

    return `http://localhost:3000${coverImage}`;
  };

  const displayBooks = books.length > 0 ? books : getFallbackBooks();

  if (loading) {
    return (
      <section className="w-full bg-[#fdfaf6] px-4 py-8">
        <div className="mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
              Recommended For You
            </h2>
            <button className="text-sm sm:text-base font-medium text-gray-700 hover:text-amber-700 transition-colors text-center sm:text-right">
              See all →
            </button>
          </div>
          <div className="flex justify-center py-12">
            <div className="text-lg text-gray-600">
              Loading recommended books...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#fdfaf6] px-4 py-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
            Recommended For You
          </h2>
          <Link
            to="/books"
            className="text-sm sm:text-base font-medium text-gray-700 hover:text-amber-700 transition-colors text-center sm:text-right flex items-center gap-2"
          >
            See all →
          </Link>
        </div>

        {error && (
          <div className="text-center text-yellow-600 mb-4">
            {error} - Showing sample books
          </div>
        )}

        {/* Horizontal Book List */}
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide pb-4">
          {displayBooks.map((book) => (
            <div
              key={book.id}
              className="flex-shrink-0 w-52 group transition-transform hover:scale-[1.02]"
            >
              {/* Book Cover */}
              <div className="w-full h-60 overflow-hidden rounded-lg shadow-sm mb-3 bg-white">
                <img
                  src={getImageUrl(book.coverImage)}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop";
                  }}
                />
              </div>

              {/* Book Info */}
              <h3 className="font-medium text-gray-900 text-base truncate">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                By : <span className="text-gray-700">{book.author.name}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedBooks;
