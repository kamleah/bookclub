import { useState } from "react";
import { Search, X, Book, User, Menu } from "lucide-react";

type HeaderProps = {
  title?: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const navLinks = [
    { key: "home", label: "Home" },
    { key: "shop", label: "Shop" },
    { key: "ebook", label: "E-book" },
    { key: "about", label: "About" },
    { key: "wishlist", label: "Wishlist" },
    { key: "my-cart", label: "My cart" },
    { key: "publish-book", label: "Publish Book" },
  ];

  const mockBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Classic",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Fiction",
    },
    { id: 3, title: "1984", author: "George Orwell", category: "Dystopian" },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      category: "Romance",
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      category: "Fiction",
    },
  ];

  const filteredResults = mockBooks.filter((book) => {
    const query = searchQuery.toLowerCase();
    if (searchType === "book") {
      return book.title.toLowerCase().includes(query);
    } else if (searchType === "author") {
      return book.author.toLowerCase().includes(query);
    }
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-serif text-amber-700">
                Books Club
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 flex-1 justify-center">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={`/${link.key}`}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu (Mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-amber-700 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-amber-700 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Search</span>
              </button>

              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.key}
                    href={`/${link.key}`}
                    className="text-gray-600 hover:text-amber-700 transition-colors text-sm font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">EN</span>
                  <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <div
        className={`fixed inset-0 bg-white z-50 transition-transform duration-500 ease-in-out ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Modal Header */}
          <div className="border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-serif text-amber-700">
                  Search Books & Authors
                </h2>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for books or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-amber-700 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-2 sm:space-x-4 mt-4">
                <button
                  onClick={() => setSearchType("all")}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    searchType === "all"
                      ? "bg-amber-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSearchType("book")}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    searchType === "book"
                      ? "bg-amber-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Books
                </button>
                <button
                  onClick={() => setSearchType("author")}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    searchType === "author"
                      ? "bg-amber-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Authors
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {searchQuery === "" ? (
                <div className="text-center py-12">
                  <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Start typing to search for books and authors
                  </p>
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Found {filteredResults.length} result
                    {filteredResults.length !== 1 ? "s" : ""}
                  </p>
                  {filteredResults.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-200"
                    >
                      <div className="w-12 h-16 bg-amber-100 rounded flex items-center justify-center flex-shrink-0">
                        <Book className="w-6 h-6 text-amber-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {book.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                        <span className="inline-block mt-2 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded">
                          {book.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
