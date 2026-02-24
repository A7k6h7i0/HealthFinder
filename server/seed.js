import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";
import generateToken from "./src/utils/generateToken.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDB();
  
  try {
    const admin = await User.findOne({ email: "admin@healthfinder.com" });
    if (!admin) {
      await User.create({
        name: "Platform Admin",
        email: "admin@healthfinder.com",
        password: "admin123",
        role: "admin"
      });
      console.log("✅ Admin created: admin@healthfinder.com / admin123");
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
