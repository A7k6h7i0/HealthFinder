import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axiosClient";
import SearchFilters from "../components/SearchFilters";
import ServiceCard from "../components/ServiceCard";
import DisclaimerBanner from "../components/DisclaimerBanner";

const emptyPagination = {
  total: 0,
  page: 1,
  pages: 1,
  limit: 10
};

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDiseaseId = searchParams.get("diseaseId") || "";
  const initialDisease = searchParams.get("disease") || "";
  const initialPage = parseInt(searchParams.get("page"), 10) || 1;

  const [filteredCenters, setFilteredCenters] = useState([]);
  const [allCenters, setAllCenters] = useState([]);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [filteredPagination, setFilteredPagination] = useState(emptyPagination);
  const [allPagination, setAllPagination] = useState(emptyPagination);
  const [allPage, setAllPage] = useState(1);
  const [filters, setFilters] = useState({
    diseaseId: initialDiseaseId,
    disease: initialDisease,
    page: initialPage
  });
  const [appliedFilters, setAppliedFilters] = useState({
    diseaseId: initialDiseaseId,
    disease: initialDisease,
    page: initialPage
  });

  const hasActiveSearch = Boolean(appliedFilters.diseaseId || String(appliedFilters.disease || "").trim());

  const fetchFilteredCenters = async (activeFilters) => {
    setLoadingFiltered(true);
    try {
      const params = {};
      Object.entries(activeFilters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get("/centers", { params });
      setFilteredCenters(res.data.centers);
      setFilteredPagination(res.data.pagination);
    } catch (err) {
      setFilteredCenters([]);
      setFilteredPagination(emptyPagination);
      console.error("Failed to fetch filtered centers");
    } finally {
      setLoadingFiltered(false);
    }
  };

  const fetchAllCenters = async (page = 1) => {
    setLoadingAll(true);
    try {
      const res = await api.get("/centers", { params: { page } });
      setAllCenters(res.data.centers);
      setAllPagination(res.data.pagination);
    } catch (err) {
      setAllCenters([]);
      setAllPagination(emptyPagination);
      console.error("Failed to fetch all centers");
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    if (!hasActiveSearch) {
      navigate("/search");
      return;
    }
    fetchFilteredCenters(appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters.diseaseId, appliedFilters.disease, appliedFilters.page, hasActiveSearch]);

  useEffect(() => {
    fetchAllCenters(allPage);
  }, [allPage]);

  const syncUrlParams = (updatedFilters) => {
    const params = {};
    Object.entries(updatedFilters).forEach(([k, v]) => {
      if (v) params[k] = String(v);
    });
    setSearchParams(params);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleSearchSubmit = (overrideFilters) => {
    const updated = {
      ...(overrideFilters || filters),
      page: 1
    };
    setAppliedFilters(updated);
    syncUrlParams(updated);
  };

  const handleFilteredPageChange = (newPage) => {
    const updated = { ...appliedFilters, page: newPage };
    setAppliedFilters(updated);
    syncUrlParams(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <div className="text-center pt-2">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-teal-700">
          Kaaya Kalpa
        </h1>
        <p className="text-sm text-slate-500 mt-2">Search results for treatment centers</p>
      </div>

      <DisclaimerBanner />

      <SearchFilters filters={filters} onChange={handleFilterChange} onSearch={handleSearchSubmit} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Search Results</h2>

        {loadingFiltered && (
          <div className="text-sm text-slate-500">Loading matching centers...</div>
        )}

        {!loadingFiltered && filteredCenters.length === 0 && (
          <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
            No matching centers found for your search.
          </div>
        )}

        {!loadingFiltered && filteredCenters.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              {filteredCenters.map((center) => (
                <ServiceCard key={center._id} service={center} />
              ))}
            </div>

            {filteredPagination.pages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => handleFilteredPageChange(filteredPagination.page - 1)}
                  disabled={filteredPagination.page === 1}
                  className="px-4 py-2 border border-slate-200 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  Page {filteredPagination.page} of {filteredPagination.pages}
                </span>
                <button
                  onClick={() => handleFilteredPageChange(filteredPagination.page + 1)}
                  disabled={filteredPagination.page === filteredPagination.pages}
                  className="px-4 py-2 border border-slate-200 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Other Approved Service Centers</h2>

        {loadingAll && <div className="text-sm text-slate-500">Loading approved centers...</div>}

        {!loadingAll && allCenters.length === 0 && (
          <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
            No approved centers available right now.
          </div>
        )}

        {!loadingAll && allCenters.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              {allCenters.map((center) => (
                <ServiceCard key={center._id} service={center} />
              ))}
            </div>

            {allPagination.pages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setAllPage((p) => p - 1)}
                  disabled={allPagination.page === 1}
                  className="px-4 py-2 border border-slate-200 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  Page {allPagination.page} of {allPagination.pages}
                </span>
                <button
                  onClick={() => setAllPage((p) => p + 1)}
                  disabled={allPagination.page === allPagination.pages}
                  className="px-4 py-2 border border-slate-200 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default SearchResults;
