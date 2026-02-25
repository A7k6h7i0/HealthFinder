import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import DisclaimerBanner from "../components/DisclaimerBanner";
import BrandLogo from "../components/BrandLogo";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!search || search.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await api.get(`/diseases/search?q=${search}`);
        setSuggestions(res.data);
      } catch (_err) {
        console.error("Failed to fetch suggestions");
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/results?disease=${encodeURIComponent(search)}`);
    }
  };

  const handleSelectSuggestion = (disease) => {
    setSearch(disease.name);
    setShowSuggestions(false);
    navigate(`/search/results?diseaseId=${disease._id}`);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="mb-8 text-center flex flex-col items-center">
          <BrandLogo className="mb-3" />
          <p className="text-sm text-slate-500 mt-2">
            Discover trusted wellness and treatment centers near you
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
          <div className="relative">
            <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow px-4 py-3">
              <svg
                className="w-5 h-5 text-slate-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search for diseases..."
                className="flex-1 text-base text-slate-700 outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSuggestions([]);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {suggestions.map((disease) => (
                  <button
                    key={disease._id}
                    type="button"
                    onClick={() => handleSelectSuggestion(disease)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span className="text-slate-700">{disease.name}</span>
                    {disease.parentDiseaseId && (
                      <span className="text-xs text-slate-400">Disease Type</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 font-medium text-sm shadow-sm hover:shadow transition-all"
            >
              Search Centers
            </button>
            <Link
              to="/search"
              className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 font-medium text-sm shadow-sm hover:shadow transition-all"
            >
              Browse All
            </Link>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="text-sm text-slate-500">Popular:</span>
          {["Cancer", "Diabetes", "Heart Disease", "Kidney Disease"].map((term) => (
            <button
              key={term}
              onClick={() => navigate(`/search/results?disease=${encodeURIComponent(term)}`)}
              className="text-sm text-teal-600 hover:underline"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Find Centers</h3>
              <p className="text-sm text-slate-600">
                Search verified treatment centers by disease and location
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Verified Centers</h3>
              <p className="text-sm text-slate-600">
                Business-verified centers with license validation
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Community Driven</h3>
              <p className="text-sm text-slate-600">
                All centers approved by admins for quality assurance
              </p>
            </div>
          </div>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
};

export default Home;
