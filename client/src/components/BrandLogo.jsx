const BrandLogo = ({ compact = false, className = "" }) => {
  return (
    <div className={`inline-flex items-center ${className}`.trim()}>
      <svg
        viewBox="0 0 64 64"
        role="img"
        aria-label="Kaaya Kalpa logo"
        className="w-9 h-9"
      >
        <defs>
          <linearGradient id="kkLeaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id="kkCore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        <circle cx="32" cy="32" r="30" fill="#f0fdfa" stroke="#99f6e4" strokeWidth="2" />
        <path d="M32 15C24 21 21 29 22 38c8 0 14-2 19-7 4-4 6-10 6-16-6 0-11 2-15 6z" fill="url(#kkLeaf)" />
        <path d="M41 24c-3 1-7 4-10 9-3 5-4 10-4 14" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="43" cy="42" r="7" fill="url(#kkCore)" />
      </svg>

      {!compact && (
        <span className="ml-2 text-xl font-bold tracking-tight text-teal-700">
          Kaaya Kalpa
        </span>
      )}
    </div>
  );
};

export default BrandLogo;
