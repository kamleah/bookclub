import React from "react";
import { ChevronRight } from "lucide-react";

export type Author = {
  id: string | number;
  name: string;
  label: string;
  image: string;
  url?: string;
};

type AuthorCardProps = {
  author: Author;
  className?: string;
};

const AuthorCard: React.FC<AuthorCardProps> = ({ author, className }) => {
  return (
    <div
      key={author.id}
      className={`swiper-slide ${className ?? ""}`}
      style={{ width: "auto" }}
    >
      <a
        href={author.url ?? "#"}
        className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-all duration-300 group cursor-pointer border border-gray-200 hover:border-gray-300 hover:shadow-sm"
      >
        {/* Author Image */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all">
          <img
            src={author.image}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Author Label */}
        <span className="text-sm text-gray-600 group-hover:text-gray-800 font-medium whitespace-nowrap transition-colors">
          {author.label}
        </span>

        {/* Arrow Icon */}
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all group-hover:translate-x-0.5" />
      </a>
    </div>
  );
};

export default AuthorCard;
