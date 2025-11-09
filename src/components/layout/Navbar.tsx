import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, User, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Stream<span className="text-primary-500">Verse</span>
            </span>
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden w-full max-w-xl lg:block"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos, channels..."
              className="w-full rounded-full border border-neutral-700 bg-neutral-800 py-2 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white lg:hidden"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>

          {isAuthenticated ? (
            <>
              <button
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                aria-label="Notifications"
              >
                <Bell size={20} />
              </button>
              <div className="relative">
                <button
                  onClick={handleUserMenuToggle}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-neutral-800 bg-neutral-900 shadow-lg"
                    >
                      <div className="border-b border-neutral-800 p-3">
                        <p className="font-medium text-white">
                          {user?.username}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/history"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-md px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
                        >
                          Watch History
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-neutral-800"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      <form
        onSubmit={handleSearch}
        className="border-t border-neutral-800 p-3 lg:hidden"
      >
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos, channels..."
            className="w-full rounded-full border border-neutral-700 bg-neutral-800 py-2 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>
    </header>
  );
};

export default Navbar;
