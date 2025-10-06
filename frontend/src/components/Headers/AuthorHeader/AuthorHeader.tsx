import { ReactNode, useState } from "react";
import { Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { BookSearch } from "../../../features";

interface NavLink {
  key: string;
  label: string;
  path: string;
}

interface NavbarProps {
  navLinks: NavLink[];
}

type AuthorHeaderProps = {
  title?: string;
  children?: ReactNode; // ✅ allow children
  navLinks?: NavLink[];
};

const AuthorHeader: React.FC<AuthorHeaderProps> = ({
  title,
  children,
  navLinks,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl text-amber-700">
                Books Club
              </h1>
            </div>
            

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 flex-1 justify-center">
              {(navLinks ?? []).map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {link.label}
                </Link>
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
                {(navLinks ?? []).map((link) => (
                  <Link
                    key={link.key}
                    to={link.path}
                    className="text-gray-600 hover:text-amber-700 transition-colors text-sm font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
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

      {/* ✅ Render children below header */}
      <main className="min-h-screen bg-gray-50 pt-20">{children}</main>
      <BookSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(book) => {
          console.log("Selected book:", book);
          setIsSearchOpen(false);
        }}
      />
    </>
  );
};

export default AuthorHeader;
