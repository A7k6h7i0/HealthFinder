import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const ServiceCard = ({ service, showReportButton = true }) => {
  const { user } = useAuth();
  const [reported, setReported] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (!user) return alert("Login to report a center");
    const reason = prompt("Why do you want to report this center?");
    if (!reason) return;
    setLoading(true);
    try {
      await api.post("/reports", { serviceId: service._id, reason });
      setReported(true);
    } catch (e) {
      alert("Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{service.name}</h3>
        {service.status === "approved" && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Verified
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600 line-clamp-3">
        {service.description}
      </p>

      <div className="flex flex-wrap gap-2 text-xs">
        {service.diseases?.map((d) => (
          <span
            key={d}
            className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200"
          >
            {d}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap justify-between text-xs text-slate-600 gap-2">
        <span>
          {service.location.city}, {service.location.state}
        </span>
        <span className="font-medium text-primary">
          {service.priceRange || "Pricing info on request"}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {service.treatmentType}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          Contact: <span className="font-medium">{service.contact}</span>
        </span>
        {showReportButton && (
          <button
            disabled={reported || loading}
            onClick={handleReport}
            className="text-red-600 hover:text-red-700 border border-red-200 px-2 py-1 rounded-md hover:bg-red-50 disabled:opacity-60"
          >
            {reported ? "Reported" : "Report"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
