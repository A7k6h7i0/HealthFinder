const SearchFilters = ({ filters, onChange, onSubmit }) => {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-600">
          Search by disease
        </label>
        <div className="flex items-center gap-2 border border-slate-300 rounded-full px-4 py-2 bg-slate-50 focus-within:border-primary">
          <span className="text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            name="disease"
            value={filters.disease}
            onChange={handleChange}
            placeholder='e.g. "knee pain"'
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="flex flex-col gap-1">
          <label className="font-medium text-slate-600">City</label>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="Kadapa"
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium text-slate-600">State</label>
          <input
            type="text"
            name="state"
            value={filters.state}
            onChange={handleChange}
            placeholder="Andhra Pradesh"
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium text-slate-600">Treatment type</label>
          <select
            name="treatmentType"
            value={filters.treatmentType}
            onChange={handleChange}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm"
          >
            <option>All</option>
            <option>Ayurveda</option>
            <option>Herbal</option>
            <option>Local therapy</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-xs">
        <label className="font-medium text-slate-600">
          Price range (highlight only)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={handleChange}
            placeholder="Min (optional)"
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={handleChange}
            placeholder="Max (optional)"
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="self-start inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary text-white text-sm font-medium shadow-sm hover:bg-teal-700"
      >
        Search centers
      </button>
    </form>
  );
};

export default SearchFilters;
