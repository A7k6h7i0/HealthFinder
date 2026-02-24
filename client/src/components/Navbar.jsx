import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold">
            HS
          </span>
          <span className="font-semibold text-slate-800">
            Health Service Finder
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? "text-primary font-medium" : "text-slate-600"
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/add-service"
            className={({ isActive }) =>
              isActive ? "text-primary font-medium" : "text-slate-600"
            }
          >
            Add Center
          </NavLink>
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "text-primary font-medium" : "text-slate-600"
              }
            >
              Admin
            </NavLink>
          )}
          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-primary font-medium" : "text-slate-600"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "text-primary font-medium" : "text-slate-600"
                }
              >
                Register
              </NavLink>
            </>
          )}
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-slate-600">
                {user.name}{" "}
                <span className="ml-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs border border-emerald-200">
                  {user.role}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 border border-red-200 px-2 py-1 rounded-md hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
