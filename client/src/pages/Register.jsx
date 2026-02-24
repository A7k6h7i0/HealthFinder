import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      login(res.data);
      navigate("/search");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900">
        Create an account
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        You need an account to submit new centers or report misleading data.
      </p>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4"
      >
        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-1 text-sm">
          <label className="block text-slate-600">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label className="block text-slate-600">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label className="block text-slate-600">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-teal-700"
        >
          Register
        </button>
        <p className="text-xs text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
