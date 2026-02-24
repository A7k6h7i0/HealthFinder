import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import SearchFilters from "../components/SearchFilters";
import ServiceCard from "../components/ServiceCard";
import DisclaimerBanner from "../components/DisclaimerBanner";

const Search = () => {
  const [filters, setFilters] = useState({
    disease: "",
    city: "",
    state: "",
    treatmentType: "All",
    priceMin: "",
    priceMax: ""
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get("/services", { params });
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        Search treatment centers
      </h2>
      <DisclaimerBanner />
      <SearchFilters
        filters={filters}
        onChange={setFilters}
        onSubmit={fetchServices}
      />
      <div className="mt-4">
        {loading && <div className="text-sm text-slate-500">Loading...</div>}
        {!loading && services.length === 0 && (
          <div className="text-sm text-slate-500">
            No centers found. Try a different disease or location.
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          {services.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
