import mongoose from "mongoose";
import dotenv from "dotenv";
import Disease from "./src/models/Disease.js";
import User from "./src/models/User.js";
import Center from "./src/models/Center.js";

dotenv.config();

const diseases = [
  // Cancer types
  { name: "Cancer", description: "General cancer treatment", category: "Oncology", order: 1 },
  
  // Heart diseases
  { name: "Heart Disease", description: "Heart-related conditions", category: "Cardiology", order: 2 },
  
  // Diabetes
  { name: "Diabetes", description: "Diabetes management and treatment", category: "Endocrinology", order: 3 },
  
  // Kidney diseases
  { name: "Kidney Disease", description: "Kidney-related conditions", category: "Nephrology", order: 4 },
  
  // Liver diseases
  { name: "Liver Disease", description: "Liver-related conditions", category: "Hepatology", order: 5 },
  
  // Respiratory
  { name: "Respiratory Disease", description: "Lung and respiratory conditions", category: "Pulmonology", order: 6 },
  
  // Neurological
  { name: "Neurological Disorder", description: "Brain and nerve conditions", category: "Neurology", order: 7 },
  
  // Orthopedic
  { name: "Orthopedic", description: "Bone and joint conditions", category: "Orthopedics", order: 8 },
  
  // Skin
  { name: "Skin Disease", description: "Skin conditions", category: "Dermatology", order: 9 },
  
  // Mental Health
  { name: "Mental Health", description: "Mental health conditions", category: "Psychiatry", order: 10 }
];

const diseaseTypes = [
  // Cancer types
  { name: "Lung Cancer", parentName: "Cancer", description: "Lung cancer treatment", category: "Oncology" },
  { name: "Breast Cancer", parentName: "Cancer", description: "Breast cancer treatment", category: "Oncology" },
  { name: "Blood Cancer", parentName: "Cancer", description: "Leukemia and blood cancers", category: "Oncology" },
  { name: "Liver Cancer", parentName: "Cancer", description: "Liver cancer treatment", category: "Oncology" },
  { name: "Prostate Cancer", parentName: "Cancer", description: "Prostate cancer treatment", category: "Oncology" },
  
  // Heart types
  { name: "Heart Failure", parentName: "Heart Disease", description: "Heart failure treatment", category: "Cardiology" },
  { name: "Coronary Artery Disease", parentName: "Heart Disease", description: "CAD treatment", category: "Cardiology" },
  { name: "Arrhythmia", parentName: "Heart Disease", description: "Heart rhythm disorders", category: "Cardiology" },
  { name: "Hypertension", parentName: "Heart Disease", description: "High blood pressure", category: "Cardiology" },
  
  // Diabetes types
  { name: "Type 1 Diabetes", parentName: "Diabetes", description: "Type 1 diabetes management", category: "Endocrinology" },
  { name: "Type 2 Diabetes", parentName: "Diabetes", description: "Type 2 diabetes management", category: "Endocrinology" },
  { name: "Gestational Diabetes", parentName: "Diabetes", description: "Pregnancy diabetes", category: "Endocrinology" },
  
  // Kidney types
  { name: "Chronic Kidney Disease", parentName: "Kidney Disease", description: "CKD treatment", category: "Nephrology" },
  { name: "Kidney Stones", parentName: "Kidney Disease", description: "Kidney stone treatment", category: "Nephrology" },
  { name: "Kidney Failure", parentName: "Kidney Disease", description: "Renal failure treatment", category: "Nephrology" },
  
  // Respiratory types
  { name: "Asthma", parentName: "Respiratory Disease", description: "Asthma treatment", category: "Pulmonology" },
  { name: "COPD", parentName: "Respiratory Disease", description: "Chronic obstructive pulmonary disease", category: "Pulmonology" },
  { name: "Pneumonia", parentName: "Respiratory Disease", description: "Lung infection", category: "Pulmonology" },
  { name: "Tuberculosis", parentName: "Respiratory Disease", description: "TB treatment", category: "Pulmonology" },
  
  // Neurological types
  { name: "Alzheimer's Disease", parentName: "Neurological Disorder", description: "Memory loss condition", category: "Neurology" },
  { name: "Parkinson's Disease", parentName: "Neurological Disorder", description: "Movement disorder", category: "Neurology" },
  { name: "Epilepsy", parentName: "Neurological Disorder", description: "Seizure disorder", category: "Neurology" },
  { name: "Migraine", parentName: "Neurological Disorder", description: "Severe headaches", category: "Neurology" }
];

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
