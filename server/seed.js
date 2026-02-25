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
    types: ["Lung Cancer", "Breast Cancer", "Colorectal Cancer", "Blood Cancer", "Liver Cancer", "Prostate Cancer", "Cervical Cancer", "Thyroid Cancer"]
  },
  {
    name: "Heart Disease",
    description: "Cardiac and vascular conditions",
    category: "Cardiology",
    types: ["Heart Failure", "Coronary Artery Disease", "Arrhythmia", "Hypertension", "Cardiomyopathy", "Valve Disease", "Congenital Heart Disease", "Peripheral Artery Disease"]
  },
  {
    name: "Endocrine & Metabolic Disorders",
    description: "Hormonal and metabolic disorders",
    category: "Endocrinology",
    types: ["Type 1 Diabetes", "Type 2 Diabetes", "Gestational Diabetes", "Hypothyroidism", "Hyperthyroidism", "PCOS", "Obesity", "Metabolic Syndrome"]
  },
  {
    name: "Kidney & Urinary Disorders",
    description: "Nephrology and urinary conditions",
    category: "Nephrology",
    types: ["Chronic Kidney Disease", "Kidney Stones", "Kidney Failure", "Nephrotic Syndrome", "Urinary Tract Infection", "Glomerulonephritis", "Polycystic Kidney Disease", "Urinary Incontinence"]
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
    types: ["Asthma", "COPD", "Pneumonia", "Tuberculosis", "Bronchitis", "Sleep Apnea", "Pulmonary Fibrosis", "Pleural Effusion"]
  },
  {
    name: "Neurological Disorders",
    description: "Brain, nerve and spinal conditions",
    category: "Neurology",
    types: ["Alzheimer's Disease", "Parkinson's Disease", "Epilepsy", "Migraine", "Stroke", "Multiple Sclerosis", "Neuropathy", "Meningitis"]
  },
  {
    name: "Bone & Joint Disorders",
    description: "Orthopedic and rheumatology disorders",
    category: "Orthopedics",
    types: ["Osteoarthritis", "Rheumatoid Arthritis", "Spondylitis", "Fracture", "Osteoporosis", "Gout", "Tendon Injury", "Lumbar Disc Disease"]
  },
  {
    name: "Skin Diseases",
    description: "Dermatology conditions",
    category: "Dermatology",
    types: ["Eczema", "Psoriasis", "Acne", "Fungal Infection", "Vitiligo", "Urticaria", "Dermatitis", "Scabies"]
  },
  {
    name: "Mental Health Disorders",
    description: "Psychiatry and behavioral health conditions",
    category: "Psychiatry",
    types: ["Depression", "Anxiety Disorder", "Bipolar Disorder", "Schizophrenia", "OCD", "PTSD", "Panic Disorder", "Substance Use Disorder"]
  },
  {
    name: "Digestive Disorders",
    description: "Gastrointestinal conditions",
    category: "Gastroenterology",
    types: ["GERD", "Peptic Ulcer Disease", "Irritable Bowel Syndrome", "Ulcerative Colitis", "Crohn's Disease", "Pancreatitis", "Appendicitis", "Hemorrhoids"]
  },
  {
    name: "Infectious Diseases",
    description: "Communicable diseases and infections",
    category: "Infectious Disease",
    types: ["COVID-19", "Dengue", "Malaria", "Typhoid", "Chikungunya", "Influenza", "HIV/AIDS", "Leptospirosis"]
  },
  {
    name: "Women's Health",
    description: "Gynecology and obstetric conditions",
    category: "Gynecology",
    types: ["Menstrual Disorders", "Endometriosis", "Fibroids", "Ovarian Cyst", "Infertility", "High-Risk Pregnancy", "Pelvic Inflammatory Disease", "Cervicitis"]
  },
  {
    name: "Men's Health",
    description: "Andrology and male reproductive conditions",
    category: "Andrology",
    types: ["Erectile Dysfunction", "Male Infertility", "Prostatitis", "Benign Prostatic Hyperplasia", "Varicocele", "Low Testosterone", "Premature Ejaculation", "Hydrocele"]
  },
  {
    name: "Eye Disorders",
    description: "Ophthalmic conditions",
    category: "Ophthalmology",
    types: ["Cataract", "Glaucoma", "Conjunctivitis", "Dry Eye Syndrome", "Diabetic Retinopathy", "Refractive Error", "Macular Degeneration", "Corneal Ulcer"]
  },
  {
    name: "Ear, Nose & Throat Disorders",
    description: "ENT conditions",
    category: "ENT",
    types: ["Sinusitis", "Tonsillitis", "Otitis Media", "Hearing Loss", "Vertigo", "Rhinitis", "Nasal Polyps", "Laryngitis"]
  },
  {
    name: "Blood & Immune Disorders",
    description: "Hematology and immunology conditions",
    category: "Hematology",
    types: ["Anemia", "Thalassemia", "Hemophilia", "Sickle Cell Disease", "Leukopenia", "Autoimmune Disease", "Lupus", "Immune Thrombocytopenia"]
  },
  {
    name: "Pediatric Conditions",
    description: "Common childhood conditions",
    category: "Pediatrics",
    types: ["Neonatal Jaundice", "ADHD", "Autism Spectrum Disorder", "Cerebral Palsy", "Childhood Asthma", "Chickenpox", "Measles", "Mumps"]
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
    types: ["Fever", "Chronic Pain", "Fatigue Syndrome", "Allergy", "Dehydration", "Vitamin Deficiency", "Unspecified Condition", "Other"]
  }
];

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
