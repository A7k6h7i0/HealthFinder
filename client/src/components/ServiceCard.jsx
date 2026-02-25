import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const {
    name,
    diseaseName,
    description,
    priceRange,
    location,
    contact,
    isVerified,
    status,
    viewCount
  } = service;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{name}</h3>
            {isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>

          <p className="text-sm text-teal-600 mt-1">
            {diseaseName || "General Treatment"}
          </p>
        </div>

        {status === "pending" && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
            Pending
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600 mt-2 line-clamp-2">
        {description}
      </p>

      {priceRange && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
            {priceRange}
          </span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {location?.city}, {location?.state}
          </span>
        </div>

        {contact?.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{contact.phone}</span>
          </div>
        )}

        {contact?.email && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{contact.email}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Link
          to={`/center/${service._id}`}
          className="text-sm text-teal-600 hover:underline font-medium"
        >
          View Details
        </Link>
        {viewCount > 0 && (
          <span className="text-xs text-slate-400">
            {viewCount} views
          </span>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
