import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../Buttons";

const BookDiscovery: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 flex flex-col justify-center items-start space-y-4 sm:space-y-5 md:space-y-6 transition-all duration-300 hover:shadow-xl sm:hover:shadow-2xl sm:hover:-translate-y-1">
      {/* Heading with responsive sizes and better line-height */}
      <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight tracking-tight">
        Find Your Next Book
      </h1>

      {/* Paragraph with responsive text size and improved spacing */}
      <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose">
        Discover a world where every page brings a new adventure. At Paper
        Haven, we curate a diverse collection of books for every reader.
      </p>

      {/* Button with responsive padding and margins */}
      <Button
        variant="primary"
        className="w-full sm:w-auto mt-2 sm:mt-4 flex items-center justify-center sm:justify-start space-x-2 py-3 sm:py-2 px-6 text-base sm:text-lg"
        title="Explore Now"
      />
    </div>
  );
};

export default BookDiscovery;
