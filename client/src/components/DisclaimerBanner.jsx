const DisclaimerBanner = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-3 rounded-lg">
      <p className="font-semibold mb-1">Important medical disclaimer</p>
      <p className="leading-relaxed">
        We are not medical advisors. This platform lists community-submitted
        health service centers. Information may be incomplete or outdated. Always
        consult qualified medical professionals before making health decisions.
      </p>
    </div>
  );
};

export default DisclaimerBanner;
