import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./BrandLogo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo compact />
            <span className="text-lg font-semibold text-teal-700">Kaaya Kalpa</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/search" className="text-sm text-slate-600 hover:text-teal-600">
              Search
            </Link>

            {user ? (
              <>
                <Link to="/add-service" className="text-sm text-slate-600 hover:text-teal-600">
                  Add Center
                </Link>

                {user.role === "admin" && (
                  <Link to="/admin" className="text-sm text-slate-600 hover:text-teal-600">
                    Admin
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600">
                    <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden lg:inline">{user.name}</span>
                    {user.role === "business" && user.isLicenseVerified && (
                      <span className="text-xs text-teal-600">verified</span>
                    )}
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        {user.role === "business" && (
                          <span className="text-xs text-teal-600">Business Account</span>
                        )}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-slate-600 hover:text-teal-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden relative flex items-center gap-2" ref={mobileMenuRef}>
            {user && (
              <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 top-11 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                <Link
                  to="/search"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search
                </Link>
                {user && (
                  <Link
                    to="/add-service"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Add Center
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
