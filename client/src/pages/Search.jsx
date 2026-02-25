import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilters from "../components/SearchFilters";
import DisclaimerBanner from "../components/DisclaimerBanner";

const Search = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    diseaseId: "",
    disease: "",
    page: 1
  });

  const handleSearchSubmit = (submittedFilters) => {
    const params = new URLSearchParams();
    const payload = submittedFilters || filters;
    if (payload.diseaseId) params.set("diseaseId", payload.diseaseId);
    if (payload.disease) params.set("disease", payload.disease);
    params.set("page", "1");
    navigate(`/search/results?${params.toString()}`);
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

      <SearchFilters filters={filters} onChange={setFilters} onSearch={handleSearchSubmit} />
    </div>
  );
};

export default Search;
