import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import AuthorCard, { Author } from "../../Card/AuthorCard/AuthorCard";
import "./AuthorCarousel.module.css";

type AuthorCarouselProps = {
  title?: string;
  authors?: Author[];
};

type ApiAuthor = {
  id: number;
  name: string;
  bio?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

const AuthorCarousel: React.FC<AuthorCarouselProps> = ({
  title,
  authors: propAuthors,
}) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propAuthors) {
      // Use provided authors if available
      setAuthors(propAuthors);
      setLoading(false);
    } else {
      // Fetch authors from API
      fetchAuthors();
    }
  }, [propAuthors]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/authors?limit=10');
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        const formattedAuthors: Author[] = data.data.map((author: ApiAuthor) => ({
          id: author.id,
          name: author.name,
          image: author.image 
            ? `http://localhost:3000${author.image}`
            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
          label: `Latest from ${author.name}`,
          bio: author.bio
        }));
        setAuthors(formattedAuthors);
      } else {
        setError('Invalid data format received from API');
      }
    } catch (err) {
      setError('Failed to load authors. Please try again later.');
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fallback authors if API fails and no prop authors provided
  const getFallbackAuthors = (): Author[] => [
    {
      id: 1,
      name: "James Clear",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      label: "Latest from James Clear",
    },
    {
      id: 2,
      name: "Napoleon Hill",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      label: "Latest from Napoleon Hill",
    },
    {
      id: 3,
      name: "Robert Kiyosaki",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      label: "Latest from Robert Kiyosaki",
    },
    {
      id: 4,
      name: "Brian Tracy",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
      label: "Latest from Brian Tracy",
    },
  ];

  const displayAuthors = authors.length > 0 ? authors : getFallbackAuthors();

  if (loading) {
    return (
      <section className="w-full flex flex-col items-center py-2 bg-gray-50">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
        )}
        <div className="w-full flex justify-center py-8">
          <div className="text-lg text-gray-600">Loading authors...</div>
        </div>
      </section>
    );
  }

  if (error && authors.length === 0) {
    return (
      <section className="w-full flex flex-col items-center py-2 bg-gray-50">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
        )}
        <div className="w-full flex justify-center py-8">
          <div className="text-lg text-red-600 text-center">
            {error}
            <button 
              onClick={fetchAuthors}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col items-center py-2 bg-gray-50">
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h2>
      )}

      <div className="w-full relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={7}
          breakpoints={{
            480: { slidesPerView: 1, spaceBetween: 1 },
            640: { slidesPerView: 2, spaceBetween: 2 },
            768: { slidesPerView: 3, spaceBetween: 3 },
            1024: { slidesPerView: 4, spaceBetween: 4 },
            1280: { slidesPerView: 5, spaceBetween: 5 },
            1536: { slidesPerView: 6, spaceBetween: 6 },
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={displayAuthors.length > 1}
          modules={[Pagination, Autoplay]}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="w-full justify-center items-center"
          speed={800}
        >
          {displayAuthors.map((author) => (
            <SwiperSlide key={author.id} className="!w-auto">
              <div className="px-1 py-1 mb-6">
                <AuthorCard author={author} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {error && (
          <div className="text-center mt-2 text-yellow-600 text-sm">
            Using cached data: {error}
          </div>
        )}
      </div>
    </section>
  );
};

export default AuthorCarousel;