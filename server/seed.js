import mongoose from "mongoose";
import dotenv from "dotenv";
import Disease from "./src/models/Disease.js";
import User from "./src/models/User.js";
import Center from "./src/models/Center.js";
import { majorDiseaseCatalog, demoDiagnosticCenters } from "./src/constants/demoDiagnosticCatalog.js";

dotenv.config();

const DEMO_OWNER_EMAIL = "demo.centers@kaayakalpa.dev";
const DEMO_OWNER_PASSWORD = "Demo@123456";

const upsertDemoOwner = async () => {
  const existing = await User.findOne({ email: DEMO_OWNER_EMAIL });
  if (existing) {
    existing.name = "KaayaKalpa Demo Admin";
    existing.role = "business";
    existing.isMobileVerified = true;
    existing.isLicenseVerified = true;
    existing.phone = "+91-9000000001";
    existing.businessName = "KaayaKalpa Demo Diagnostics";
    existing.licenseNumber = "KAAYA-DEMO-2026";
    existing.licenseUrl = "/uploads/licenses/demo-license.pdf";
    await existing.save();
    return existing;
  }

  return User.create({
    name: "KaayaKalpa Demo Admin",
    email: DEMO_OWNER_EMAIL,
    password: DEMO_OWNER_PASSWORD,
    phone: "+91-9000000001",
    role: "business",
    isMobileVerified: true,
    isLicenseVerified: true,
    businessName: "KaayaKalpa Demo Diagnostics",
    licenseNumber: "KAAYA-DEMO-2026",
    licenseUrl: "/uploads/licenses/demo-license.pdf"
  });
};

const seedDiseasesAndCenters = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const owner = await upsertDemoOwner();
  console.log("Demo owner ready");

  await Center.deleteMany({});
  await Disease.deleteMany({});
  console.log("Cleared centers and diseases");

  const parentDiseaseDocs = await Disease.insertMany(
    majorDiseaseCatalog.map((group, index) => ({
      name: group.category,
      description: group.description,
      category: group.category,
      order: index + 1,
      isActive: true
    }))
  );
  const parentByName = parentDiseaseDocs.reduce((map, doc) => {
    map[doc.name] = doc;
    return map;
  }, {});
  console.log(`Created ${parentDiseaseDocs.length} parent diseases`);

  const subtypeDocs = [];
  majorDiseaseCatalog.forEach((group) => {
    const parent = parentByName[group.category];
    group.subcategories.forEach((subName, subIndex) => {
      if (subName.toLowerCase() === group.category.toLowerCase()) return;
      subtypeDocs.push({
        name: subName,
        parentDiseaseId: parent._id,
        description: `${subName} diagnostics and specialist support`,
        category: group.category,
        order: subIndex + 1,
        isActive: true
      });
    });
  });
  await Disease.insertMany(subtypeDocs);
  console.log(`Created ${subtypeDocs.length} disease subcategories`);

  const centerDocs = demoDiagnosticCenters.map((center) => {
    const parentDisease = parentByName[center.disease_category];
    return {
      name: center.center_name,
      diseaseId: parentDisease._id,
      diseaseName: center.disease_category,
      ownerId: owner._id,
      location: {
        address: center.address,
        city: center.city,
        state: center.state,
        pincode: ""
      },
      contact: {
        phone: center.contact_number,
        email: center.email,
        website: center.website
      },
      description: `${center.description} Supported conditions: ${center.diseases_supported.join(", ")}.`,
      treatmentType: "Allopathic",
      priceRange: `Services: ${center.services.join(", ")}`,
      photos: center.image_urls,
      businessLicenseNumber: "KAAYA-DEMO-2026",
      licenseUrl: "/uploads/licenses/demo-license.pdf",
      isVerified: true,
      status: "approved",
      viewCount: Math.floor(Math.random() * 250) + 30
    };
  });

  await Center.insertMany(centerDocs);
  console.log(`Created ${centerDocs.length} demo diagnostic centers`);

  console.log("Seed completed successfully");
  console.log(`Demo login email: ${DEMO_OWNER_EMAIL}`);
};

seedDiseasesAndCenters()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
