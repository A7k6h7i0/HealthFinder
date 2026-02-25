import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axiosClient";

const CenterDetails = () => {
  const { id } = useParams();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCenter = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/centers/${id}`);
        setCenter(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load center details");
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-slate-500">Loading center details...</div>;
  }

  if (error || !center) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-3">
        <p className="text-sm text-red-600">{error || "Center not found"}</p>
        <Link to="/search" className="text-sm text-teal-600 hover:underline">
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <Link to="/search" className="text-sm text-teal-600 hover:underline">
          Back to Search
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">{center.name}</h1>
        <p className="text-sm text-teal-600">{center.diseaseName || "General Treatment"}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Description</h2>
          <p className="text-sm text-slate-700 mt-1">{center.description || "No description provided"}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-800">Address</h2>
          <p className="text-sm text-slate-700 mt-1">
            {center.location?.address}, {center.location?.city}, {center.location?.state}
            {center.location?.pincode ? ` - ${center.location.pincode}` : ""}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Contact Number</h2>
            <p className="text-sm text-slate-700 mt-1">{center.contact?.phone || "N/A"}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Email</h2>
            <p className="text-sm text-slate-700 mt-1">{center.contact?.email || "N/A"}</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-800">Website</h2>
          {center.contact?.website ? (
            <a
              href={center.contact.website}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-teal-600 hover:underline mt-1 inline-block"
            >
              {center.contact.website}
            </a>
          ) : (
            <p className="text-sm text-slate-700 mt-1">N/A</p>
          )}
        </div>
      </div>

      {Array.isArray(center.photos) && center.photos.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">Photos</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {center.photos.map((url, index) => (
              <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer" className="text-sm text-teal-600 hover:underline break-all">
                {url}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterDetails;
