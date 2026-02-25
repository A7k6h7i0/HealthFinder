import { useState, useEffect, useRef } from "react";
import api from "../api/axiosClient";

const flattenDiseaseHierarchy = (nodes, level = 0, path = []) => {
  const rows = [];
  nodes.forEach((node) => {
    const nextPath = [...path, node.name];
    rows.push({
      _id: node._id,
      name: node.name,
      level,
      pathLabel: nextPath.join(" > ")
    });

    if (Array.isArray(node.types) && node.types.length > 0) {
      rows.push(...flattenDiseaseHierarchy(node.types, level + 1, nextPath));
    }
  });
  return rows;
};

const SearchFilters = ({ filters, onChange, onSearch }) => {
  const [diseaseQuery, setDiseaseQuery] = useState(filters.disease || "");
  const [diseaseOptions, setDiseaseOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setDiseaseQuery(filters.disease || "");
  }, [filters.disease]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchHierarchy = async () => {
      setLoading(true);
      try {
        const res = await api.get("/diseases/hierarchy");
        const flattened = flattenDiseaseHierarchy(res.data);
        setDiseaseOptions(flattened);
        setFilteredOptions(flattened);
      } catch (err) {
        console.error("Failed to load diseases", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchy();
  }, []);

  const filterSuggestions = (query) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return diseaseOptions;
    return diseaseOptions.filter((item) => item.pathLabel.toLowerCase().includes(normalized));
  };

  const handleDiseaseChange = (e) => {
    const value = e.target.value;
    setDiseaseQuery(value);
    onChange({ ...filters, diseaseId: "", disease: value });
    setFilteredOptions(filterSuggestions(value));
    setShowSuggestions(true);
  };

  const handleSelectDisease = (disease) => {
    setDiseaseQuery(disease.name);
    setFilteredOptions(filterSuggestions(disease.name));
    setShowSuggestions(false);
    onChange({ ...filters, diseaseId: disease._id, disease: disease.name });
  };

  const handleSearchClick = () => {
    if (typeof onSearch === "function") {
      onSearch({
        ...filters,
        disease: diseaseQuery,
        page: 1
      });
    }
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
      <div className="relative" ref={wrapperRef}>
        <label className="block text-xs text-slate-500 mb-2">Disease Search</label>
        <input
          type="text"
          value={diseaseQuery}
          onChange={handleDiseaseChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearchClick();
            }
          }}
          onFocus={() => {
            setFilteredOptions(filterSuggestions(diseaseQuery));
            setShowSuggestions(true);
          }}
          placeholder="Search diseases..."
          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
        />

        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-10 max-h-72 overflow-y-auto">
            {loading && <div className="px-3 py-2 text-sm text-slate-500">Loading diseases...</div>}
            {!loading && filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-slate-500">No disease matches found</div>
            )}
            {!loading &&
              filteredOptions.slice(0, 60).map((disease) => (
                <button
                  key={disease._id}
                  type="button"
                  onClick={() => handleSelectDisease(disease)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm"
                >
                  <span className="text-slate-900">{disease.name}</span>
                  <span className="text-xs text-slate-500 ml-2">{disease.pathLabel}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={handleSearchClick}
          className="px-4 py-2 text-sm text-white bg-teal-600 rounded-md hover:bg-teal-700"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            onChange({
              diseaseId: "",
              disease: ""
            });
            setDiseaseQuery("");
            setFilteredOptions(diseaseOptions);
            if (typeof onSearch === "function") {
              onSearch({ diseaseId: "", disease: "", page: 1 });
            }
          }}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
