import Disease from "../models/Disease.js";
import { findRelatedDiseasesFromSymptoms, looksLikeSymptomDescription } from "../services/symptomMatcher.js";

// Get all diseases (with hierarchy)
export const getAllDiseases = async (req, res) => {
  try {
    const { search, parentId } = req.query;
    
    let query = { isActive: true };
    
    // If searching
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    // If filtering by parent
    if (parentId) {
      query.parentDiseaseId = parentId;
    } else if (!search) {
      // Get root diseases (no parent) by default
      query.parentDiseaseId = null;
    }

    const diseases = await Disease.find(query)
      .sort({ order: 1, name: 1 });

    res.json(diseases);
  } catch (err) {
    console.error("Get diseases error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get diseases with hierarchy structure
export const getDiseasesHierarchy = async (req, res) => {
  try {
    // Get all active diseases
    const diseases = await Disease.find({ isActive: true })
      .sort({ order: 1, name: 1 });

    // Build hierarchy
    const diseaseMap = {};
    const rootDiseases = [];

    // First pass: create map
    diseases.forEach(disease => {
      diseaseMap[disease._id] = {
        ...disease.toObject(),
        types: []
      };
    });

    // Second pass: build hierarchy
    diseases.forEach(disease => {
      if (disease.parentDiseaseId) {
        const parent = diseaseMap[disease.parentDiseaseId];
        if (parent) {
          parent.types.push(diseaseMap[disease._id]);
        }
      } else {
        rootDiseases.push(diseaseMap[disease._id]);
      }
    });

    res.json(rootDiseases);
  } catch (err) {
    console.error("Get hierarchy error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get disease by ID
export const getDiseaseById = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }
    res.json(disease);
  } catch (err) {
    console.error("Get disease error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Search diseases (for autocomplete)
export const searchDiseases = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const directMatches = await Disease.find({
      isActive: true,
      name: { $regex: q, $options: "i" }
    })
    .sort({ name: 1 })
    .limit(25);

    let symptomMatches = [];
    const shouldUseSymptomAi = looksLikeSymptomDescription(q) || (String(q).trim().length >= 3 && directMatches.length < 8);
    if (shouldUseSymptomAi) {
      const allActiveDiseases = await Disease.find(
        { isActive: true },
        { _id: 1, name: 1, parentDiseaseId: 1, category: 1 }
      ).lean();
      symptomMatches = await findRelatedDiseasesFromSymptoms(q, allActiveDiseases, 25);
    }

    const mergedMap = new Map();
    [...symptomMatches, ...directMatches].forEach((disease) => {
      mergedMap.set(String(disease._id), {
        _id: disease._id,
        name: disease.name,
        parentDiseaseId: disease.parentDiseaseId || null,
        category: disease.category
      });
    });

    const results = [...mergedMap.values()].slice(0, 25);

    res.json(results);
  } catch (err) {
    console.error("Search diseases error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Create disease
export const createDisease = async (req, res) => {
  try {
    const { name, parentDiseaseId, description, category, order } = req.body;

    // Check if disease with same name exists
    const exists = await Disease.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) {
      return res.status(400).json({ message: "Disease already exists" });
    }

    const disease = await Disease.create({
      name,
      parentDiseaseId: parentDiseaseId || null,
      description,
      category: category || "General",
      order: order || 0
    });

    res.status(201).json(disease);
  } catch (err) {
    console.error("Create disease error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Update disease
export const updateDisease = async (req, res) => {
  try {
    const disease = await Disease.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    res.json(disease);
  } catch (err) {
    console.error("Update disease error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Delete disease
export const deleteDisease = async (req, res) => {
  try {
    // Check if disease has children
    const hasChildren = await Disease.countDocuments({ parentDiseaseId: req.params.id });
    if (hasChildren > 0) {
      return res.status(400).json({ message: "Cannot delete disease with subtypes" });
    }

    const disease = await Disease.findByIdAndDelete(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    res.json({ message: "Disease deleted" });
  } catch (err) {
    console.error("Delete disease error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
