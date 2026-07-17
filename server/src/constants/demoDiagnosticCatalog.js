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
      "Lymphoma",
      "Prostate Cancer",
      "Cervical Cancer",
      "Colon Cancer",
      "Oral Cancer",
      "Thyroid Cancer"
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
    subcategories: [
      "Heart Disease",
      "Heart Attack",
      "Coronary Artery Disease",
      "Arrhythmia",
      "Cardiomyopathy",
      "Hypertension (High Blood Pressure)",
      "Heart Failure",
      "Valvular Heart Disease"
    ],
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
    subcategories: ["Liver Disease", "Fatty Liver", "Hepatitis", "Liver Cirrhosis", "Liver Failure", "Jaundice"],
    services: ["Liver Function Test", "FibroScan", "Hepatitis Profile", "Abdominal Ultrasound"]
  },
  {
    category: "Neurological Disorders",
    description: "Neurology diagnostics with brain and nerve disorder evaluation.",
    subcategories: [
      "Neurological Disorders",
      "Epilepsy",
      "Stroke",
      "Parkinson's Disease",
      "Multiple Sclerosis",
      "Migraine",
      "Alzheimer's Disease",
      "Dementia",
      "Bell's Palsy"
    ],
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
    subcategories: [
      "Orthopedic Problems",
      "Arthritis",
      "Back Pain",
      "Osteoporosis",
      "Fracture",
      "Joint Pain",
      "Gout",
      "Frozen Shoulder",
      "Slipped Disc"
    ],
    services: ["X-Ray", "Bone Density Scan", "MRI Spine", "Joint Marker Panel"]
  },
  {
    category: "Blood Disorders",
    description: "Hematology-focused diagnostics for blood and clotting disorders.",
    subcategories: ["Blood Disorders", "Anemia", "Thalassemia", "Hemophilia", "Sickle Cell Disease", "Leukopenia", "Thrombocytopenia"],
    services: ["CBC", "Peripheral Smear", "Coagulation Profile", "Hemoglobin Electrophoresis"]
  },
  {
    category: "Thyroid Disorders",
    description: "Thyroid and hormone profile diagnostics for endocrine health.",
    subcategories: ["Thyroid Disorders", "Hypothyroidism", "Hyperthyroidism", "Goiter", "Thyroiditis"],
    services: ["TSH", "T3/T4 Panel", "Thyroid Antibody Test", "Thyroid Ultrasound"]
  },
  {
    category: "Common Cold, Flu & Fever",
    description: "Diagnostics for common seasonal viral and respiratory illnesses.",
    subcategories: [
      "Common Cold",
      "Influenza (Flu)",
      "Viral Fever",
      "Sore Throat",
      "Sinusitis",
      "Seasonal Allergies",
      "Bronchitis",
      "Laryngitis"
    ],
    services: ["Rapid Flu Test", "Throat Swab Culture", "CBC", "CRP Test"]
  },
  {
    category: "Gastrointestinal & Digestive Disorders",
    description: "Diagnostics and imaging for stomach, intestine and digestive conditions.",
    subcategories: [
      "Stomach Pain",
      "Gastritis",
      "Acid Reflux (GERD)",
      "Peptic Ulcer",
      "Irritable Bowel Syndrome (IBS)",
      "Food Poisoning",
      "Constipation",
      "Diarrhea",
      "Appendicitis",
      "Piles (Hemorrhoids)",
      "Gallstones",
      "Indigestion (Dyspepsia)",
      "Lactose Intolerance"
    ],
    services: ["Endoscopy", "Colonoscopy", "Abdominal Ultrasound", "Stool Analysis", "H. Pylori Test"]
  },
  {
    category: "Skin & Dermatological Disorders",
    description: "Dermatology diagnostics for skin, hair and nail conditions.",
    subcategories: [
      "Acne",
      "Eczema",
      "Psoriasis",
      "Fungal Skin Infection",
      "Skin Allergy (Dermatitis)",
      "Vitiligo",
      "Urticaria (Hives)",
      "Ringworm",
      "Scabies",
      "Dandruff",
      "Warts",
      "Skin Cyst"
    ],
    services: ["Skin Biopsy", "Dermoscopy", "Patch Test", "KOH Test"]
  },
  {
    category: "Eye Disorders",
    description: "Ophthalmology diagnostics for vision and eye health.",
    subcategories: [
      "Conjunctivitis (Eye Flu)",
      "Cataract",
      "Glaucoma",
      "Myopia (Nearsightedness)",
      "Hyperopia (Farsightedness)",
      "Dry Eye Syndrome",
      "Stye",
      "Retinal Disorders",
      "Color Blindness",
      "Eye Infection"
    ],
    services: ["Eye Refraction Test", "Tonometry", "Fundus Examination", "Slit Lamp Exam"]
  },
  {
    category: "ENT (Ear, Nose & Throat) Disorders",
    description: "ENT diagnostics for ear, nose, throat and hearing conditions.",
    subcategories: [
      "Ear Infection (Otitis)",
      "Tonsillitis",
      "Hearing Loss",
      "Allergic Rhinitis",
      "Vertigo",
      "Nasal Polyps",
      "Deviated Nasal Septum",
      "Throat Infection",
      "Tinnitus"
    ],
    services: ["Audiometry", "Nasal Endoscopy", "ENT Examination", "Throat Culture"]
  },
  {
    category: "Dental & Oral Health",
    description: "Dental diagnostics and oral health assessments.",
    subcategories: [
      "Tooth Decay (Cavities)",
      "Gum Disease (Gingivitis)",
      "Tooth Pain",
      "Periodontitis",
      "Oral Ulcers",
      "Bad Breath (Halitosis)",
      "Tooth Sensitivity",
      "Wisdom Tooth Impaction"
    ],
    services: ["Dental X-Ray", "Oral Examination", "Root Canal Assessment", "Dental Cleaning"]
  },
  {
    category: "Mental Health & Psychiatric Disorders",
    description: "Mental health screening and psychiatric evaluation services.",
    subcategories: [
      "Depression",
      "Anxiety Disorder",
      "Stress",
      "Bipolar Disorder",
      "Panic Attack",
      "Obsessive-Compulsive Disorder (OCD)",
      "Post-Traumatic Stress Disorder (PTSD)",
      "Schizophrenia",
      "Eating Disorders"
    ],
    services: ["Psychiatric Evaluation", "Psychological Counseling", "Mental Health Screening", "Cognitive Assessment"]
  },
  {
    category: "Sleep Disorders",
    description: "Sleep medicine diagnostics for rest and breathing disorders during sleep.",
    subcategories: ["Insomnia", "Sleep Apnea", "Narcolepsy", "Restless Leg Syndrome", "Snoring Disorders"],
    services: ["Sleep Study (Polysomnography)", "Sleep Apnea Screening"]
  },
  {
    category: "Infectious & Vector-Borne Diseases",
    description: "Diagnostics for common infectious, viral and vector-borne illnesses.",
    subcategories: [
      "Malaria",
      "Dengue Fever",
      "Typhoid",
      "Chikungunya",
      "COVID-19",
      "Chickenpox",
      "Measles",
      "Mumps",
      "Swine Flu (H1N1)",
      "Rubella"
    ],
    services: ["Malaria Antigen Test", "Dengue NS1 Test", "Widal Test", "RT-PCR Test", "CBC"]
  },
  {
    category: "Sexually Transmitted Infections",
    description: "Confidential screening and diagnostics for sexually transmitted infections.",
    subcategories: ["HIV/AIDS", "Syphilis", "Gonorrhea", "Genital Herpes", "Human Papillomavirus (HPV)", "Chlamydia"],
    services: ["STI Screening Panel", "HIV Test", "VDRL Test", "PCR Test"]
  },
  {
    category: "Women's Health & Gynecological Disorders",
    description: "Gynecological diagnostics and women's health screening.",
    subcategories: [
      "PCOS/PCOD",
      "Menstrual Disorders",
      "Uterine Fibroids",
      "Endometriosis",
      "Menopause",
      "Ovarian Cysts",
      "Vaginal Infection",
      "Infertility (Female)"
    ],
    services: ["Pelvic Ultrasound", "Hormone Panel", "Pap Smear", "Gynecological Examination"]
  },
  {
    category: "Pregnancy & Maternal Health",
    description: "Prenatal and maternal health diagnostics.",
    subcategories: [
      "Morning Sickness",
      "Preeclampsia",
      "Ectopic Pregnancy",
      "Placenta Previa",
      "Postpartum Depression",
      "Miscarriage"
    ],
    services: ["Prenatal Ultrasound", "Antenatal Checkup", "Amniocentesis", "NST (Non-Stress Test)"]
  },
  {
    category: "Urological & Men's Health Disorders",
    description: "Urology and men's health diagnostics.",
    subcategories: [
      "Erectile Dysfunction",
      "Prostate Enlargement (BPH)",
      "Low Testosterone",
      "Male Infertility",
      "Urinary Tract Infection (UTI)",
      "Bladder Infection",
      "Urinary Incontinence"
    ],
    services: ["PSA Test", "Urine Culture", "Urological Ultrasound", "Semen Analysis"]
  },
  {
    category: "Pediatric & Childhood Disorders",
    description: "Pediatric diagnostics and developmental screening for children.",
    subcategories: [
      "Childhood Asthma",
      "ADHD",
      "Autism Spectrum Disorder",
      "Growth Delay",
      "Childhood Obesity",
      "Common Childhood Infections",
      "Learning Disabilities"
    ],
    services: ["Pediatric Growth Assessment", "Developmental Screening", "Pediatric Consultation"]
  },
  {
    category: "Allergy & Immunology",
    description: "Allergy testing and immunology diagnostics.",
    subcategories: [
      "Food Allergy",
      "Dust Allergy",
      "Pollen Allergy",
      "Drug Allergy",
      "Anaphylaxis",
      "Insect Sting Allergy",
      "Latex Allergy"
    ],
    services: ["Allergy Panel Test", "Skin Prick Test", "IgE Test"]
  },
  {
    category: "Autoimmune & Rheumatological Disorders",
    description: "Rheumatology diagnostics for autoimmune and joint-related conditions.",
    subcategories: [
      "Lupus (SLE)",
      "Rheumatoid Arthritis",
      "Celiac Disease",
      "Psoriatic Arthritis",
      "Ankylosing Spondylitis",
      "Sjogren's Syndrome"
    ],
    services: ["ANA Test", "RA Factor Test", "Autoimmune Panel"]
  },
  {
    category: "Nutritional & Metabolic Disorders",
    description: "Nutritional assessment and metabolic health diagnostics.",
    subcategories: [
      "Obesity",
      "Malnutrition",
      "Vitamin D Deficiency",
      "Vitamin B12 Deficiency",
      "Iron Deficiency",
      "Calcium Deficiency",
      "Metabolic Syndrome"
    ],
    services: ["Vitamin Panel Test", "Nutritional Assessment", "Metabolic Panel"]
  },
  {
    category: "Headache & Chronic Pain Disorders",
    description: "Diagnostics for chronic pain and headache conditions.",
    subcategories: [
      "Tension Headache",
      "Cluster Headache",
      "Sinus Headache",
      "Chronic Fatigue Syndrome",
      "Fibromyalgia",
      "Sciatica"
    ],
    services: ["MRI Brain", "Neurological Examination", "Pain Assessment"]
  },
  {
    category: "General Health & Common Symptoms",
    description: "General health checkups for common, non-specific symptoms.",
    subcategories: [
      "Fatigue",
      "Body Pain",
      "Weakness",
      "Unexplained Weight Loss",
      "Unexplained Weight Gain",
      "Fever of Unknown Origin",
      "Dehydration"
    ],
    services: ["General Health Checkup", "Full Body Checkup", "CBC", "Basic Metabolic Panel"]
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
