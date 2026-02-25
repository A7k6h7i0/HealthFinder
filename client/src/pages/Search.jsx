import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axiosClient";
import SearchFilters from "../components/SearchFilters";
import ServiceCard from "../components/ServiceCard";
import DisclaimerBanner from "../components/DisclaimerBanner";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  });

  const [filters, setFilters] = useState({
    diseaseId: searchParams.get("diseaseId") || "",
    disease: searchParams.get("disease") || "",
    page: parseInt(searchParams.get("page"), 10) || 1
  });

  const fetchCenters = async (activeFilters) => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(activeFilters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });

      const res = await api.get("/centers", { params });
      setCenters(res.data.centers);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Failed to fetch centers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.diseaseId, filters.disease, filters.page]);

  const syncUrlParams = (updatedFilters) => {
    const params = {};
    Object.entries(updatedFilters).forEach(([k, v]) => {
      if (v) params[k] = String(v);
    });
    setSearchParams(params);
  };

  const handleFilterChange = (newFilters) => {
    const updated = { ...newFilters, page: 1 };
    setFilters(updated);
    syncUrlParams(updated);
  };

  const handlePageChange = (newPage) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
    syncUrlParams(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <div className="text-center pt-2">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-teal-700">
          Kaaya Kalpa
        </h1>
        <p className="text-sm text-slate-500 mt-2">Find trusted treatment centers by disease</p>
      </div>

      <DisclaimerBanner />

      <SearchFilters filters={filters} onChange={handleFilterChange} />

      <div className="mt-4">
        {loading && (
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading centers...
          </div>
        )}

        {!loading && centers.length === 0 && (
          <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
            No centers found. Try different search criteria or browse all centers.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mt-2">
          {centers.map((center) => (
            <ServiceCard key={center._id} service={center} />
          ))}
        </div>

        {pagination.pages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-slate-200 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-sm text-slate-600">
              Page {pagination.page} of {pagination.pages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border border-slate-200 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {!loading && centers.length > 0 && (
          <p className="text-xs text-slate-500 text-center mt-4">
            Showing {centers.length} of {pagination.total} centers
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
