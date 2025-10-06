import React from "react";
import { AuthorList, AuthorProfile, Authors, BookDetails, Books, Dashboard, Ebook, NotFound, UserHome } from "./pages";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AuthorHeader } from "./components/Headers";

const App: React.FC = () => {
  const location = useLocation();

  const defaultNavLinks = [
    { key: "home", label: "Home", path: "/" },
    { key: "ebook", label: "E-book", path: "/ebook" },
    { key: "author", label: "Author", path: "/author" },
    { key: "publish-book", label: "Publish Book", path: "/publish-book" },
  ];

  const publishNavLinks = [
    { key: "dashboard", label: "Dashboard", path: "/publish-book/dashboard" },
    { key: "author", label: "Author", path: "/publish-book/author" },
    { key: "books", label: "Books", path: "/publish-book/book" },
    { key: "books-club", label: "Books Club", path: "/" },
  ];

  const navLinks = location.pathname.startsWith("/publish-book")
    ? publishNavLinks
    : defaultNavLinks;

  return (
    <AuthorHeader navLinks={navLinks}>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/shop" element={<UserHome />} />
        <Route path="/ebook" element={<Ebook />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/author" element={<AuthorList />} />
        <Route path="/author/:id" element={<AuthorProfile />} />
        <Route path="/wishlist" element={<UserHome />} />
        <Route path="/my-cart" element={<UserHome />} />

        {/* Redirect /publish-book to /publish-book/dashboard */}
        <Route path="/publish-book" element={<Navigate to="/publish-book/dashboard" replace />} />

        <Route path="/publish-book/dashboard" element={<Dashboard />} />
        <Route path="/publish-book/book" element={<Books />} />
        <Route path="/publish-book/author" element={<Authors />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthorHeader>
  );
};

export default App;
