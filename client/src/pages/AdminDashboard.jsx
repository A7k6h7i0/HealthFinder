import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import ServiceCard from "../components/ServiceCard";

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, rRes] = await Promise.all([
        api.get("/admin/services/pending"),
        api.get("/admin/reports")
      ]);
      setPending(pRes.data);
      setReports(rRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    await api.put(`/admin/services/${id}/approve`);
    fetchData();
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection? (stored informally)");
    await api.put(`/admin/services/${id}/reject`, { reason });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    await api.delete(`/admin/services/${id}`);
    fetchData();
  };

  const handleMarkReportReviewed = async (id) => {
    await api.put(`/admin/reports/${id}/reviewed`);
    fetchData();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        Admin moderation dashboard
      </h2>
      <p className="text-xs text-slate-500">
        Review pending submissions, approve only those with reasonable
        information and, if possible, verification proof. Remove misleading or
        unsafe entries.
      </p>

      {loading && <div className="text-sm text-slate-500">Loading...</div>}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">
          Pending submissions ({pending.length})
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {pending.map((s) => (
            <div key={s._id} className="space-y-2">
              <ServiceCard service={s} showReportButton={false} />
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => handleApprove(s._id)}
                  className="px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(s._id)}
                  className="px-3 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
              {s.proof && (
                <p className="text-xs text-slate-500">
                  Proof provided: <span className="font-medium">{s.proof}</span>
                </p>
              )}
            </div>
          ))}
          {pending.length === 0 && (
            <p className="text-xs text-slate-500">
              No pending submissions right now.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">
          User reports ({reports.length})
        </h3>
        <div className="space-y-3 text-xs">
          {reports.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col gap-1"
            >
              <p className="text-slate-700">
                Service:{" "}
                <span className="font-medium">
                  {r.service?.name || "Deleted service"}
                </span>
              </p>
              <p className="text-slate-600">Reason: {r.reason}</p>
              <p className="text-slate-500">
                Status:{" "}
                <span className="font-medium uppercase">{r.status}</span>
              </p>
              <button
                disabled={r.status === "reviewed"}
                onClick={() => handleMarkReportReviewed(r._id)}
                className="self-start mt-1 px-3 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Mark as reviewed
              </button>
            </div>
          ))}
          {reports.length === 0 && (
            <p className="text-xs text-slate-500">
              No reports submitted by users yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
