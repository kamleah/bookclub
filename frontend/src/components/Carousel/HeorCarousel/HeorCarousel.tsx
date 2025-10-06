import styles from "./HeorCarousel.module.css";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

type Book = {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  publishedYear: number;
  createdAt: string;
  author: {
    id: number;
    name: string;
    image: string;
  };
};

type HeorCarouselProps = {
  title?: string;
};

const HeorCarousel: React.FC<HeorCarouselProps> = ({ title }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCarouselBooks();
  }, []);

  const fetchCarouselBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/bookclub/carousel');
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.data);
      } else {
        setError(data.message || 'Failed to fetch books');
      }
    } catch (err) {
      setError('Failed to load books. Please try again later.');
      console.error('Error fetching carousel books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fallback image URL in case coverImage is not available
  const getImageUrl = (coverImage: string | null) => {
    if (!coverImage) {
      return "https://i.pinimg.com/736x/8b/76/23/8b7623370485558951323071af149988.jpg";
    }
    
    // If it's already a full URL, return as is
    if (coverImage.startsWith('http')) {
      return coverImage;
    }
    
    // If it's a relative path, prepend the base URL
    return `http://localhost:3000${coverImage}`;
  };

  if (loading) {
    return (
      <div className="flex-1 w-full max-w-2xl lg:max-w-3xl">
        <div className="flex items-center justify-center h-72">
          <div className="text-lg text-gray-600">Loading books...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 w-full max-w-2xl lg:max-w-3xl">
        <div className="flex items-center justify-center h-72">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex-1 w-full max-w-2xl lg:max-w-3xl">
        <div className="flex items-center justify-center h-72">
          <div className="text-lg text-gray-600">No books available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-2xl lg:max-w-3xl">
      {title && (
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {title}
        </h2>
      )}
      
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        breakpoints={{
          // Mobile: 1 slide
          480: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          // Tablet: 2 slides
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // Laptop: 3 slides
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Pagination, Autoplay]}
        loop={books.length > 1}
        className="h-full w-full"
      >
        {books.map((book, index) => (
          <SwiperSlide key={book.id}>
            <div className="flex flex-col items-center justify-center p-2 mb-6 sm:p-4">
              <div
                className={`
                w-60 h-72
                ${index % 2 === 0 ? "rounded-b-full" : "rounded-t-full"}
                bg-gradient-to-br from-[#EEECE1] to-[#EEECE1]
                p-2 
                flex items-center justify-center 
                transition-all duration-500 
                hover:scale-105 hover:shadow-xl
                relative
              `}
              >
                <img
                  src={getImageUrl(book.coverImage)}
                  alt={`Cover of ${book.title}`}
                  className="
                  w-36 h-48 
                  object-cover rounded-lg transform hover:scale-110 transition-transform duration-300
                  shadow-md
                "
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = "https://i.pinimg.com/736x/8b/76/23/8b7623370485558951323071af149988.jpg";
                  }}
                />
              </div>
              
              {/* Book Info */}
              <div className="mt-4 text-center max-w-48">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  by {book.author.name}
                </p>
                {book.publishedYear && (
                  <p className="text-xs text-gray-500 mt-1">
                    {book.publishedYear}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeorCarousel;