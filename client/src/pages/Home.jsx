import { Link } from "react-router-dom";
import DisclaimerBanner from "../components/DisclaimerBanner";

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Find community-driven health service centers near you
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Search treatment centers by disease, location, and therapy type. All
            entries are user-submitted and approved by an admin to reduce
            misinformation. This is not a replacement for professional medical
            advice.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              to="/search"
              className="px-4 py-2 rounded-full bg-primary text-white font-medium shadow-sm hover:bg-teal-700"
            >
              Search centers
            </Link>
            <Link
              to="/add-service"
              className="px-4 py-2 rounded-full border border-primary text-primary hover:bg-teal-50"
            >
              Submit a center
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 rounded-full bg-slate-100">
              ✔ Admin approval before listing
            </span>
            <span className="px-2 py-1 rounded-full bg-slate-100">
              ✔ Report misleading content
            </span>
            <span className="px-2 py-1 rounded-full bg-slate-100">
              ✔ Future: ratings, AI suggestions, maps
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="h-40 rounded-xl bg-gradient-to-br from-emerald-50 to-sky-50 flex items-center justify-center text-slate-500 text-sm">
            Map integration placeholder (future upgrade)
          </div>
          <p className="mt-3 text-xs text-slate-500">
            In the future you can integrate Google Maps / Mapbox here to show
            locations of approved centers.
          </p>
        </div>
      </section>
      <DisclaimerBanner />
    </div>
  );
};

export default Home;
