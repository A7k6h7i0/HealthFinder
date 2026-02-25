import { useState, useEffect, useRef } from "react";
import api from "../api/axiosClient";

const DiseaseSelect = ({ value, onChange, error }) => {
  const [diseases, setDiseases] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    fetchDiseases();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const res = await api.get("/diseases/hierarchy");
      setDiseases(res.data);
    } catch (err) {
      console.error("Failed to fetch diseases");
    } finally {
      setLoading(false);
    }
  };

  const searchDiseases = async (query) => {
    if (!query || query.length < 2) {
      fetchDiseases();
      return;
    }
    try {
      const res = await api.get(`/diseases/search?q=${query}`);
      setDiseases(res.data);
    } catch (err) {
      console.error("Search failed");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchDiseases(value);
  };

  const handleSelect = (disease) => {
    onChange(disease);
    setSearch(disease.name);
    setIsOpen(false);
  };

  const renderDisease = (disease, level = 0) => (
    <div key={disease._id}>
      <button
        type="button"
        onClick={() => handleSelect(disease)}
        className={`w-full text-left px-3 py-2 hover:bg-teal-50 text-sm ${
          level > 0 ? "pl-6 text-slate-600" : "text-slate-900 font-medium"
        }`}
      >
        {disease.name}
        {disease.types && disease.types.length > 0 && (
          <span className="text-xs text-slate-400 ml-2">
            ({disease.types.length} types)
          </span>
        )}
      </button>
      {disease.types && disease.types.length > 0 && isOpen && (
        <div className="ml-2">
          {disease.types.map((type) => renderDisease(type, level + 1))}
        </div>
      )}
    </div>
  );

  const selectedDisease = diseases.find((d) => d._id === value?._id || d._id === value);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm text-slate-600 mb-1">
        Disease Category *
      </label>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        onFocus={() => setIsOpen(true)}
        placeholder="Search diseases..."
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-2 text-sm text-slate-500">Loading...</div>
          ) : diseases.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-500">No diseases found</div>
          ) : (
            diseases.map((disease) => renderDisease(disease))
          )}
        </div>
      )}
    </div>
  );
};

export default DiseaseSelect;
