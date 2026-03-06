const majorDiseaseCatalog = [
  {
    category: "Cancer",
    description: "Comprehensive oncology diagnostics and pathology services.",
    subcategories: [
      "Cancer",
      "Blood Cancer",
      "Lung Cancer",
      "Breast Cancer",
      "Skin Cancer",
      "Brain Tumor",
      "Leukemia",
      "Lymphoma"
    ],
    services: ["PET-CT", "Biopsy", "Immunohistochemistry", "Tumor Marker Panel"]
  },
  {
    category: "Diabetes",
    description: "Endocrine and metabolic diagnostic workup for diabetes care.",
    subcategories: ["Diabetes", "Type 1 Diabetes", "Type 2 Diabetes", "Gestational Diabetes", "Prediabetes"],
    services: ["HbA1c", "Fasting Glucose", "OGTT", "Diabetic Panel"]
  },
  {
    category: "Heart Disease",
    description: "Advanced cardiac imaging and diagnostic support.",
    subcategories: ["Heart Disease", "Heart Attack", "Coronary Artery Disease", "Arrhythmia", "Cardiomyopathy"],
    services: ["ECG", "2D Echo", "Cardiac CT", "Stress Test"]
  },
  {
    category: "Kidney Disease",
    description: "Renal diagnostics including nephrology-focused pathology and imaging.",
    subcategories: ["Kidney Disease", "Kidney Stones", "Kidney Failure", "Chronic Kidney Disease", "Renal Failure"],
    services: ["Renal Function Test", "Urine Analysis", "Kidney Ultrasound", "Creatinine Panel"]
  },
  {
    category: "Liver Disease",
    description: "Liver and hepatobiliary diagnostic screening and monitoring.",
    subcategories: ["Liver Disease", "Fatty Liver", "Hepatitis", "Liver Cirrhosis", "Liver Failure"],
    services: ["Liver Function Test", "FibroScan", "Hepatitis Profile", "Abdominal Ultrasound"]
  },
  {
    category: "Neurological Disorders",
    description: "Neurology diagnostics with brain and nerve disorder evaluation.",
    subcategories: ["Neurological Disorders", "Epilepsy", "Stroke", "Parkinson's Disease", "Multiple Sclerosis", "Migraine"],
    services: ["EEG", "MRI Brain", "Nerve Conduction Study", "Neuro Panel"]
  },
  {
    category: "Lung Diseases",
    description: "Pulmonology diagnostics for chronic and acute respiratory conditions.",
    subcategories: ["Lung Diseases", "Asthma", "COPD", "Tuberculosis", "Pneumonia", "Interstitial Lung Disease"],
    services: ["PFT", "Chest CT", "Bronchoscopy Support", "Sputum Panel"]
  },
  {
    category: "Orthopedic Problems",
    description: "Musculoskeletal and orthopedic diagnostic assessments.",
    subcategories: ["Orthopedic Problems", "Arthritis", "Back Pain", "Osteoporosis", "Fracture", "Joint Pain"],
    services: ["X-Ray", "Bone Density Scan", "MRI Spine", "Joint Marker Panel"]
  },
  {
    category: "Blood Disorders",
    description: "Hematology-focused diagnostics for blood and clotting disorders.",
    subcategories: ["Blood Disorders", "Anemia", "Thalassemia", "Hemophilia", "Sickle Cell Disease"],
    services: ["CBC", "Peripheral Smear", "Coagulation Profile", "Hemoglobin Electrophoresis"]
  },
  {
    category: "Thyroid Disorders",
    description: "Thyroid and hormone profile diagnostics for endocrine health.",
    subcategories: ["Thyroid Disorders", "Hypothyroidism", "Hyperthyroidism", "Goiter", "Thyroiditis"],
    services: ["TSH", "T3/T4 Panel", "Thyroid Antibody Test", "Thyroid Ultrasound"]
  }
];

const cityAddressPool = [
  { city: "Hyderabad", state: "Telangana", address: "Road No. 12, Banjara Hills" },
  { city: "Bengaluru", state: "Karnataka", address: "100 Feet Road, Indiranagar" },
  { city: "Chennai", state: "Tamil Nadu", address: "Anna Salai, Teynampet" },
  { city: "Mumbai", state: "Maharashtra", address: "SV Road, Andheri West" },
  { city: "Pune", state: "Maharashtra", address: "FC Road, Shivajinagar" },
  { city: "Delhi", state: "Delhi", address: "Ring Road, Lajpat Nagar" },
  { city: "Noida", state: "Uttar Pradesh", address: "Sector 18, Atta Market Road" },
  { city: "Ahmedabad", state: "Gujarat", address: "SG Highway, Satellite" },
  { city: "Kolkata", state: "West Bengal", address: "AJC Bose Road, Park Street" },
  { city: "Jaipur", state: "Rajasthan", address: "Tonk Road, Malviya Nagar" },
  { city: "Lucknow", state: "Uttar Pradesh", address: "Gomti Nagar Extension Road" },
  { city: "Kochi", state: "Kerala", address: "MG Road, Ernakulam" },
  { city: "Bhopal", state: "Madhya Pradesh", address: "MP Nagar Zone-II" },
  { city: "Bhubaneswar", state: "Odisha", address: "Janpath Road, Saheed Nagar" },
  { city: "Patna", state: "Bihar", address: "Boring Road Crossing" },
  { city: "Nagpur", state: "Maharashtra", address: "Wardha Road, Dharampeth" }
];

const centerBrands = ["Apollo", "Fortis", "Medanta", "Aster", "Narayana", "Manipal", "Max", "CarePoint"];

const normalizeTerm = (value = "") =>
  String(value).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const slugify = (value = "") => normalizeTerm(value).replace(/\s+/g, "-");

const buildPhoneNumber = (categoryIndex, centerIndex) => {
  const number = 9000000000 + categoryIndex * 800 + centerIndex * 13 + 101;
  return `+91-${String(number)}`;
};

const buildCenterForCategory = (group, categoryIndex, centerIndex) => {
  const location = cityAddressPool[(categoryIndex * 3 + centerIndex) % cityAddressPool.length];
  const brand = centerBrands[centerIndex % centerBrands.length];
  const centerName = `${brand} ${group.category} Diagnostics ${location.city}`;
  const slug = slugify(`${group.category}-${location.city}-${centerIndex + 1}`);

  return {
    center_id: `CEN${String(categoryIndex + 1).padStart(2, "0")}${String(centerIndex + 1).padStart(2, "0")}`,
    center_name: centerName,
    disease_category: group.category,
    description: `${group.description} NABL-aligned reports, specialist review, and same-day digital report delivery for ${group.category.toLowerCase()} evaluations.`,
    image_urls: [
      `https://dummyimage.com/900x600/0f766e/ffffff.jpg&text=${encodeURIComponent(group.category + " Diagnostics")}`
    ],
    address: `${Math.floor(10 + categoryIndex * 2 + centerIndex)}, ${location.address}`,
    city: location.city,
    state: location.state,
    contact_number: buildPhoneNumber(categoryIndex, centerIndex),
    email: `contact@${slug}.in`,
    website: `https://www.${slug}.in`,
    services: group.services,
    diseases_supported: group.subcategories,
    rating: Number((4.2 + ((centerIndex % 4) * 0.2)).toFixed(1))
  };
};

const demoDiagnosticCenters = majorDiseaseCatalog.flatMap((group, categoryIndex) =>
  Array.from({ length: 8 }, (_, centerIndex) =>
    buildCenterForCategory(group, categoryIndex, centerIndex)
  )
);

const diseaseCategoryLookup = majorDiseaseCatalog.reduce((map, group) => {
  map[normalizeTerm(group.category)] = group.category;
  group.subcategories.forEach((item) => {
    map[normalizeTerm(item)] = group.category;
  });
  return map;
}, {});

export {
  majorDiseaseCatalog,
  demoDiagnosticCenters,
  diseaseCategoryLookup,
  normalizeTerm
};
