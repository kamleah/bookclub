import React from "react";
import { Header } from "../../components";
import { BookDiscovery } from "../../components/Card";
import { AuthorCarousel, HeorCarousel } from "../../components/Carousel";
import { RecommendedBooks } from "../../features";

const UserHome: React.FC = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 p-10">
        <BookDiscovery />
        <HeorCarousel />
      </div>
      <div className="p-4">
        <AuthorCarousel />
        <RecommendedBooks />
      </div>
    </>
  );
};

export default UserHome;
