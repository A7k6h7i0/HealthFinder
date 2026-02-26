import mongoose from "mongoose";
import dotenv from "dotenv";
import Disease from "./src/models/Disease.js";
import User from "./src/models/User.js";
import Center from "./src/models/Center.js";

dotenv.config();

const diseaseGroups = [
  {
    name: "Cancer",
    description: "Oncology-related conditions",
    category: "Oncology",
    types: [
      "Lung Cancer",
      "Breast Cancer",
      "Colorectal Cancer",
      "Blood Cancer",
      "Liver Cancer",
      "Prostate Cancer",
      "Cervical Cancer",
      "Thyroid Cancer",
      "Brain Tumor",
      "Colon Cancer",
      "Skin Cancer (Melanoma)"
    ]
  },
  {
    name: "Heart Disease",
    description: "Cardiac and vascular conditions",
    category: "Cardiology",
    types: [
      "Heart Failure",
      "Coronary Artery Disease",
      "Arrhythmia",
      "Hypertension",
      "Cardiomyopathy",
      "Valve Disease",
      "Congenital Heart Disease",
      "Peripheral Artery Disease",
      "Heart Attack",
      "High Blood Pressure (Hypertension)",
      "Ischemic Heart Disease",
      "Cerebrovascular Disease",
      "Peripheral Vascular Diseases"
    ]
  },
  {
    name: "Endocrine & Metabolic Disorders",
    description: "Hormonal and metabolic disorders",
    category: "Endocrinology",
    types: [
      "Type 1 Diabetes",
      "Type 2 Diabetes",
      "Gestational Diabetes",
      "Hypothyroidism",
      "Hyperthyroidism",
      "PCOS",
      "Obesity",
      "Metabolic Syndrome",
      "Diabetes Mellitus",
      "Diabetes (Type 1 & 2)",
      "Thyroid Disorders",
      "Adrenal Disorders",
      "Pituitary Disorders",
      "Cushing Syndrome",
      "Vitamin Deficiencies"
    ]
  },
  {
    name: "Kidney & Urinary Disorders",
    description: "Nephrology and urinary conditions",
    category: "Nephrology",
    types: [
      "Chronic Kidney Disease",
      "Kidney Stones",
      "Kidney Failure",
      "Nephrotic Syndrome",
      "Urinary Tract Infection",
      "Glomerulonephritis",
      "Polycystic Kidney Disease",
      "Urinary Incontinence",
      "Kidney Diseases",
      "Urinary Tract Diseases",
      "Prostate Disorders",
      "Bladder Disorders"
    ]
  },
  {
    name: "Liver & Biliary Disorders",
    description: "Hepatic and biliary diseases",
    category: "Hepatology",
    types: ["Fatty Liver Disease", "Hepatitis B", "Hepatitis C", "Liver Cirrhosis", "Liver Failure", "Gallstones", "Cholangitis", "Jaundice"]
  },
  {
    name: "Respiratory Diseases",
    description: "Lung and airway disorders",
    category: "Pulmonology",
    types: [
      "Asthma",
      "COPD",
      "Pneumonia",
      "Tuberculosis",
      "Bronchitis",
      "Sleep Apnea",
      "Pulmonary Fibrosis",
      "Pleural Effusion",
      "Tuberculosis (TB)",
      "Chronic Obstructive Pulmonary Disease (COPD)",
      "Interstitial Lung Disease",
      "Pulmonary Hypertension",
      "Lung Cancer"
    ]
  },
  {
    name: "Neurological Disorders",
    description: "Brain, nerve and spinal conditions",
    category: "Neurology",
    types: [
      "Alzheimer's Disease",
      "Parkinson's Disease",
      "Epilepsy",
      "Migraine",
      "Stroke",
      "Multiple Sclerosis",
      "Neuropathy",
      "Meningitis",
      "Paralysis (Loss of Muscle Movement)",
      "Neurodegenerative Diseases",
      "Headache Disorders",
      "Demyelinating Diseases",
      "Movement Disorders",
      "Peripheral Neuropathies"
    ]
  },
  {
    name: "Bone & Joint Disorders",
    description: "Orthopedic and rheumatology disorders",
    category: "Orthopedics",
    types: [
      "Osteoarthritis",
      "Rheumatoid Arthritis",
      "Spondylitis",
      "Fracture",
      "Osteoporosis",
      "Gout",
      "Tendon Injury",
      "Lumbar Disc Disease",
      "Arthritis",
      "Back Pain (Spinal Disorders)",
      "Connective Tissue Disorders",
      "Muscle Disorders",
      "Spine Disorders",
      "Muscular Dystrophy",
      "Fibromyalgia"
    ]
  },
  {
    name: "Skin Diseases",
    description: "Dermatology conditions",
    category: "Dermatology",
    types: [
      "Eczema",
      "Psoriasis",
      "Acne",
      "Fungal Infection",
      "Vitiligo",
      "Urticaria",
      "Dermatitis",
      "Scabies",
      "Skin Infections",
      "Bullous Disorders",
      "Pigment Disorders",
      "Melanoma"
    ]
  },
  {
    name: "Mental Health Disorders",
    description: "Psychiatry and behavioral health conditions",
    category: "Psychiatry",
    types: [
      "Depression",
      "Anxiety Disorder",
      "Bipolar Disorder",
      "Schizophrenia",
      "OCD",
      "PTSD",
      "Panic Disorder",
      "Substance Use Disorder",
      "ADHD",
      "Autism",
      "Mood Disorders",
      "Anxiety Disorders",
      "Personality Disorders",
      "Schizophrenia Spectrum Disorders",
      "Intellectual Disabilities"
    ]
  },
  {
    name: "Digestive Disorders",
    description: "Gastrointestinal conditions",
    category: "Gastroenterology",
    types: [
      "GERD",
      "Peptic Ulcer Disease",
      "Irritable Bowel Syndrome",
      "Ulcerative Colitis",
      "Crohn's Disease",
      "Pancreatitis",
      "Appendicitis",
      "Hemorrhoids",
      "Esophageal Disorders",
      "Gastric Disorders",
      "Liver Diseases",
      "Pancreatic Diseases",
      "Intestinal Disorders",
      "Gallbladder Disorders"
    ]
  },
  {
    name: "Infectious Diseases",
    description: "Communicable diseases and infections",
    category: "Infectious Disease",
    types: [
      "COVID-19",
      "Dengue",
      "Malaria",
      "Typhoid",
      "Chikungunya",
      "Influenza",
      "HIV/AIDS",
      "Leptospirosis",
      "Flu (Influenza)",
      "Hepatitis",
      "Hepatitis A",
      "Hepatitis C",
      "Hepatitis A, B, C",
      "Cholera",
      "Candidiasis",
      "Ringworm",
      "Amoebiasis",
      "Tapeworm Infection",
      "Creutzfeldt-Jakob Disease",
      "Sexually Transmitted Infections",
      "Bacterial Diseases",
      "Viral Diseases",
      "Fungal Diseases",
      "Parasitic Diseases",
      "Prion Diseases",
      "Vector-Borne Diseases",
      "Zoonotic Diseases"
    ]
  },
  {
    name: "Women's Health",
    description: "Gynecology and obstetric conditions",
    category: "Gynecology",
    types: [
      "Menstrual Disorders",
      "Endometriosis",
      "Fibroids",
      "Ovarian Cyst",
      "Ovarian Cysts",
      "Infertility",
      "High-Risk Pregnancy",
      "Pelvic Inflammatory Disease",
      "Cervicitis",
      "PCOS (Polycystic Ovary Syndrome)",
      "Cervical Cancer",
      "Maternal Complications",
      "Pregnancy-Induced Hypertension",
      "Labor Complications",
      "Postpartum Disorders"
    ]
  },
  {
    name: "Men's Health",
    description: "Andrology and male reproductive conditions",
    category: "Andrology",
    types: [
      "Erectile Dysfunction",
      "Male Infertility",
      "Prostatitis",
      "Benign Prostatic Hyperplasia",
      "Varicocele",
      "Low Testosterone",
      "Premature Ejaculation",
      "Hydrocele",
      "Sexual Dysfunctions"
    ]
  },
  {
    name: "Eye Disorders",
    description: "Ophthalmic conditions",
    category: "Ophthalmology",
    types: [
      "Cataract",
      "Glaucoma",
      "Conjunctivitis",
      "Dry Eye Syndrome",
      "Diabetic Retinopathy",
      "Refractive Error",
      "Macular Degeneration",
      "Corneal Ulcer",
      "Myopia (Short Sight)",
      "Retinal Diseases",
      "Optic Nerve Disorders",
      "Refractive Errors"
    ]
  },
  {
    name: "Ear, Nose & Throat Disorders",
    description: "ENT conditions",
    category: "ENT",
    types: [
      "Sinusitis",
      "Tonsillitis",
      "Otitis Media",
      "Hearing Loss",
      "Vertigo",
      "Rhinitis",
      "Nasal Polyps",
      "Laryngitis",
      "Ear Infection",
      "Tinnitus",
      "Otitis",
      "Vestibular Disorders"
    ]
  },
  {
    name: "Blood & Immune Disorders",
    description: "Hematology and immunology conditions",
    category: "Hematology",
    types: [
      "Anemia",
      "Thalassemia",
      "Hemophilia",
      "Sickle Cell Disease",
      "Leukopenia",
      "Autoimmune Disease",
      "Lupus",
      "Immune Thrombocytopenia",
      "Leukemia",
      "Lymphoma",
      "Leukemia (Blood Cancer)",
      "Clotting Disorders",
      "Anemias",
      "Coagulation Disorders",
      "Bone Marrow Failure",
      "Hemoglobinopathies",
      "Immune-Related Blood Disorders",
      "Immunodeficiency Disorders",
      "Hypersensitivity Conditions",
      "Autoinflammatory Syndromes",
      "Sickle Cell Anemia"
    ]
  },
  {
    name: "Genetic & Hereditary Disorders",
    description: "Inherited and chromosome-related disorders",
    category: "Genetics",
    types: [
      "Down Syndrome",
      "Cystic Fibrosis",
      "Sickle Cell Anemia",
      "Hemophilia",
      "Thalassemia"
    ]
  },
  {
    name: "Congenital Disorders",
    description: "Conditions present at birth",
    category: "Congenital",
    types: [
      "Congenital Heart Defects",
      "Cleft Lip",
      "Spina Bifida"
    ]
  },
  {
    name: "Autoimmune Diseases",
    description: "Immune system attacks healthy body tissues",
    category: "Immunology",
    types: [
      "Rheumatoid Arthritis",
      "Lupus",
      "Multiple Sclerosis",
      "Type 1 Diabetes",
      "Psoriasis"
    ]
  },
  {
    name: "Pediatric Conditions",
    description: "Common childhood conditions",
    category: "Pediatrics",
    types: [
      "Neonatal Jaundice",
      "ADHD",
      "Autism Spectrum Disorder",
      "Cerebral Palsy",
      "Childhood Asthma",
      "Chickenpox",
      "Measles",
      "Mumps",
      "Prematurity",
      "Neonatal Infections",
      "Birth Trauma",
      "Neonatal Respiratory Disorders"
    ]
  },
  {
    name: "Sleep-Wake Disorders",
    description: "Sleep-related disorders",
    category: "Sleep Medicine",
    types: [
      "Insomnia",
      "Hypersomnia",
      "Narcolepsy",
      "Sleep Apnea",
      "Circadian Rhythm Disorders"
    ]
  },
  {
    name: "Sexual Health Conditions",
    description: "Conditions related to sexual health",
    category: "Sexual Health",
    types: [
      "Gender Incongruence",
      "STIs Related Conditions"
    ]
  },
  {
    name: "Neoplasms (Tumors & Cancers)",
    description: "Tumor and neoplasm classifications",
    category: "Oncology",
    types: [
      "Benign Neoplasms",
      "In Situ Neoplasms",
      "Malignant Neoplasms (By Organ)",
      "Hematologic Malignancies",
      "Secondary/Metastatic Neoplasms"
    ]
  },
  {
    name: "Emergency Conditions",
    description: "Common emergency and urgent conditions",
    category: "Emergency",
    types: [
      "Food Poisoning",
      "Burns",
      "Fractures"
    ]
  },
  {
    name: "Nutritional Disorders",
    description: "Disorders caused by nutritional imbalance",
    category: "Nutrition",
    types: [
      "Obesity",
      "Malnutrition",
      "Vitamin Deficiencies"
    ]
  },
  {
    name: "Environmental & Occupational Diseases",
    description: "Conditions linked to environment and workplace exposure",
    category: "Occupational Medicine",
    types: [
      "Asbestosis",
      "Silicosis",
      "Radiation Sickness"
    ]
  },
  {
    name: "Cardiovascular & Vascular Conditions",
    description: "Additional heart and blood vessel disorders",
    category: "Cardiology",
    types: [
      "Aortic Aneurysm",
      "Aortic Dissection",
      "Myocarditis",
      "Pericarditis",
      "Endocarditis",
      "Angina",
      "Dilated Cardiomyopathy",
      "Hypertrophic Cardiomyopathy",
      "Restrictive Cardiomyopathy",
      "Atrial Fibrillation",
      "Atrial Flutter",
      "Bradycardia",
      "Tachycardia",
      "Deep Vein Thrombosis",
      "Pulmonary Embolism",
      "Peripheral Arterial Disease",
      "Carotid Artery Disease",
      "Varicose Veins",
      "Chronic Venous Insufficiency",
      "Raynaud's Disease"
    ]
  },
  {
    name: "Advanced Respiratory Conditions",
    description: "Additional lung and airway diseases",
    category: "Pulmonology",
    types: [
      "Emphysema",
      "Bronchiectasis",
      "Acute Respiratory Distress Syndrome",
      "Pneumothorax",
      "Pleurisy",
      "Pulmonary Edema",
      "Pulmonary Sarcoidosis",
      "Pulmonary Fibrosis",
      "Interstitial Pneumonia",
      "Allergic Rhinitis",
      "Whooping Cough",
      "Legionnaires' Disease",
      "Respiratory Syncytial Virus Infection",
      "Aspiration Pneumonia",
      "Occupational Asthma",
      "Chronic Sinusitis",
      "Nasal Polyposis",
      "Obstructive Sleep Apnea",
      "Central Sleep Apnea",
      "Pleural Plaque Disease"
    ]
  },
  {
    name: "Advanced Neurological Conditions",
    description: "Additional nervous system disorders",
    category: "Neurology",
    types: [
      "Amyotrophic Lateral Sclerosis",
      "Huntington's Disease",
      "Guillain-Barre Syndrome",
      "Myasthenia Gravis",
      "Bell's Palsy",
      "Trigeminal Neuralgia",
      "Cluster Headache",
      "Tension Headache",
      "Essential Tremor",
      "Cerebral Aneurysm",
      "Subarachnoid Hemorrhage",
      "Transient Ischemic Attack",
      "Frontotemporal Dementia",
      "Lewy Body Dementia",
      "Normal Pressure Hydrocephalus",
      "Hydrocephalus",
      "Encephalitis",
      "Spinal Muscular Atrophy",
      "Motor Neuron Disease",
      "Carpal Tunnel Syndrome"
    ]
  },
  {
    name: "Advanced Digestive, Liver & Pancreatic Conditions",
    description: "Additional gastrointestinal and hepatopancreatic diseases",
    category: "Gastroenterology",
    types: [
      "Gastritis",
      "Celiac Disease",
      "Diverticulosis",
      "Diverticulitis",
      "Ileus",
      "Intestinal Obstruction",
      "Acute Pancreatitis",
      "Chronic Pancreatitis",
      "Nonalcoholic Fatty Liver Disease",
      "Alcoholic Liver Disease",
      "Portal Hypertension",
      "Hepatic Encephalopathy",
      "Irritable Bowel Disease",
      "Ulcerative Proctitis",
      "Anal Fissure",
      "Fistula in Ano",
      "Gallbladder Polyps",
      "Biliary Colic",
      "Chronic Constipation",
      "Chronic Diarrhea"
    ]
  },
  {
    name: "Autoimmune, Rheumatologic & Immune Conditions",
    description: "Additional autoimmune and inflammatory conditions",
    category: "Immunology",
    types: [
      "Sjogren Syndrome",
      "Scleroderma",
      "Ankylosing Spondylitis",
      "Psoriatic Arthritis",
      "Reactive Arthritis",
      "Juvenile Idiopathic Arthritis",
      "Systemic Vasculitis",
      "Behcet's Disease",
      "Polymyositis",
      "Dermatomyositis",
      "Mixed Connective Tissue Disease",
      "Antiphospholipid Syndrome",
      "Autoimmune Hepatitis",
      "Hashimoto Thyroiditis",
      "Graves Disease",
      "IgA Nephropathy",
      "Sarcoidosis",
      "Celiac Sprue",
      "Pernicious Anemia",
      "Autoimmune Hemolytic Anemia"
    ]
  },
  {
    name: "Rare, Genetic & Metabolic Conditions",
    description: "Additional inherited, rare, and metabolic disorders",
    category: "Genetics",
    types: [
      "Turner Syndrome",
      "Klinefelter Syndrome",
      "Fragile X Syndrome",
      "Marfan Syndrome",
      "Ehlers-Danlos Syndrome",
      "Phenylketonuria",
      "Maple Syrup Urine Disease",
      "Wilson Disease",
      "Hemochromatosis",
      "Gaucher Disease",
      "Tay-Sachs Disease",
      "Duchenne Muscular Dystrophy",
      "Becker Muscular Dystrophy",
      "Osteogenesis Imperfecta",
      "Neurofibromatosis",
      "Tuberous Sclerosis",
      "Achondroplasia",
      "Alkaptonuria",
      "Homocystinuria",
      "Galactosemia"
    ]
  },
  {
    name: "Additional Infectious & Tropical Diseases",
    description: "Additional infections, vector-borne and tropical conditions",
    category: "Infectious Disease",
    types: [
      "Rabies",
      "Yellow Fever",
      "Zika Virus Infection",
      "Japanese Encephalitis",
      "West Nile Fever",
      "Chikungunya Fever",
      "Kala-Azar",
      "Leishmaniasis",
      "Filariasis",
      "Schistosomiasis",
      "Ascariasis",
      "Hookworm Infection",
      "Giardiasis",
      "Toxoplasmosis",
      "Cryptosporidiosis",
      "Brucellosis",
      "Lyme Disease",
      "Rickettsial Infection",
      "Meningococcal Disease",
      "Clostridioides Difficile Infection"
    ]
  },
  {
    name: "Pregnancy, Childbirth & Puerperium",
    description: "Maternal conditions during and after pregnancy",
    category: "Obstetrics",
    types: [
      "Pregnancy, Childbirth Or Puerperium"
    ]
  },
  {
    name: "ICD Condition Groups",
    description: "Broader ICD-style condition groupings",
    category: "General",
    types: [
      "Diseases of the Immune System",
      "Diseases of the Nervous System",
      "Diseases of the Visual System",
      "Diseases of the Ear or Mastoid Process",
      "Diseases of the Circulatory System",
      "Diseases of the Respiratory System",
      "Diseases of the Digestive System",
      "Diseases of the Skin",
      "Diseases of the Musculoskeletal System",
      "Diseases of the Genitourinary System",
      "Certain Infectious or Parasitic Diseases",
      "Diseases of the Blood or Blood-Forming Organs",
      "Mental, Behavioural or Neurodevelopmental Disorders",
      "Conditions Related to Sexual Health",
      "Certain Conditions Originating in the Perinatal Period"
    ]
  },
  {
    name: "Dental & Oral Disorders",
    description: "Dental and oral health conditions",
    category: "Dentistry",
    types: ["Dental Caries", "Gingivitis", "Periodontitis", "Oral Ulcer", "Malocclusion", "Tooth Abscess", "TMJ Disorder", "Oral Cancer"]
  },
  {
    name: "General & Other Conditions",
    description: "General medicine and uncategorized conditions",
    category: "General",
    types: [
      "Fever",
      "Chronic Pain",
      "Fatigue Syndrome",
      "Allergy",
      "Dehydration",
      "Vitamin Deficiency",
      "Unspecified Condition",
      "Other"
    ]
  }
];

const buildLargeDiseaseCatalog = (existingNames, targetCount = 1500) => {
  const organTerms = [
    "Cardiac", "Coronary", "Myocardial", "Pericardial", "Aortic", "Vascular", "Venous", "Arterial",
    "Pulmonary", "Bronchial", "Pleural", "Respiratory", "Tracheal", "Laryngeal",
    "Cerebral", "Neurologic", "Neural", "Spinal", "Peripheral Nerve", "Cranial Nerve",
    "Renal", "Nephric", "Urinary", "Bladder", "Ureteral", "Prostatic",
    "Hepatic", "Biliary", "Pancreatic", "Gastric", "Intestinal", "Colonic", "Rectal", "Esophageal",
    "Endocrine", "Thyroid", "Pituitary", "Adrenal", "Metabolic",
    "Hematologic", "Lymphatic", "Marrow", "Immunologic", "Autoimmune",
    "Dermatologic", "Cutaneous", "Epidermal", "Melanocytic",
    "Musculoskeletal", "Skeletal", "Articular", "Cartilage", "Tendon", "Ligament", "Muscular",
    "Ophthalmic", "Retinal", "Corneal", "Optic",
    "Otologic", "Vestibular", "Auditory", "Sinus",
    "Gynecologic", "Uterine", "Ovarian", "Cervical", "Obstetric",
    "Andrologic", "Testicular", "Penile", "Reproductive",
    "Pediatric", "Neonatal", "Geriatric"
  ];

  const pathologyTerms = [
    "Disease", "Disorder", "Syndrome", "Condition",
    "Inflammation", "Infection", "Injury", "Obstruction", "Insufficiency", "Failure",
    "Fibrosis", "Degeneration", "Ischemia", "Infarction", "Edema", "Hemorrhage",
    "Thrombosis", "Embolism", "Hypertrophy", "Atrophy", "Dysplasia", "Neoplasia",
    "Dysfunction", "Neuropathy", "Myopathy", "Arthropathy", "Dermatosis", "Carcinoma"
  ];

  const qualifierTerms = [
    "Acute", "Chronic", "Recurrent", "Progressive", "Severe", "Mild", "Idiopathic",
    "Primary", "Secondary", "Hereditary", "Congenital", "Autoimmune", "Infectious",
    "Inflammatory", "Degenerative", "Metabolic", "Functional", "Obstructive"
  ];

  const generated = [];
  const seen = new Set(existingNames.map((name) => name.toLowerCase()));

  for (const organ of organTerms) {
    for (const pathology of pathologyTerms) {
      const base = `${organ} ${pathology}`;
      const baseKey = base.toLowerCase();
      if (!seen.has(baseKey)) {
        generated.push(base);
        seen.add(baseKey);
      }

      for (const qualifier of qualifierTerms) {
        if (generated.length >= targetCount) break;
        const enriched = `${qualifier} ${organ} ${pathology}`;
        const enrichedKey = enriched.toLowerCase();
        if (!seen.has(enrichedKey)) {
          generated.push(enriched);
          seen.add(enrichedKey);
        }
      }
      if (generated.length >= targetCount) break;
    }
    if (generated.length >= targetCount) break;
  }

  return generated.slice(0, targetCount);
};

const existingTypeNames = diseaseGroups.flatMap((group) => group.types);
const extendedCatalogTypes = buildLargeDiseaseCatalog(existingTypeNames, 1500);

diseaseGroups.push({
  name: "Extended Clinical Disease Index",
  description: "Large indexed list to improve search coverage",
  category: "General",
  types: extendedCatalogTypes
});

const diseases = diseaseGroups.map((group, index) => ({
  name: group.name,
  description: group.description,
  category: group.category,
  order: index + 1
}));

const diseaseTypes = diseaseGroups.flatMap((group) =>
  group.types.map((typeName) => ({
    name: typeName,
    parentName: group.name,
    description: `${typeName} care and treatment`,
    category: group.category
  }))
);

const seedDiseases = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    // Clear existing diseases
    await Disease.deleteMany({});
    console.log("Cleared existing diseases");
    
    // Create parent diseases
    const parentDiseases = await Disease.insertMany(diseases);
    console.log("Created parent diseases");
    
    // Create disease types with parent references
    const parentMap = {};
    parentDiseases.forEach(d => {
      parentMap[d.name] = d._id;
    });
    
    const typesToCreate = diseaseTypes.map(d => ({
      name: d.name,
      parentDiseaseId: parentMap[d.parentName],
      description: d.description,
      category: d.category,
      order: 0,
      isActive: true
    }));
    
    await Disease.insertMany(typesToCreate);
    console.log("Created disease types");
    
    console.log("Disease seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDiseases();
