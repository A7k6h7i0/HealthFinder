import Service from "../models/Service.js";

export const searchServices = async (req, res) => {
  try {
    const { disease, city, state, priceMin, priceMax, treatmentType } = req.query;

    const query = { status: "approved" };

    if (disease) {
      query.diseases = { $regex: disease, $options: "i" };
    }

    if (city) {
      query["location.city"] = { $regex: city, $options: "i" };
    }

    if (state) {
      query["location.state"] = { $regex: state, $options: "i" };
    }

    if (treatmentType && treatmentType !== "All") {
      query.treatmentType = treatmentType;
    }

    // priceRange is stored as string so we highlight, not strictly filter by number here
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      name,
      city,
      state,
      priceRange,
      description,
      diseases,
      treatmentType,
      contact,
      photos,
      proof
    } = req.body;

    const service = await Service.create({
      name,
      location: { city, state },
      priceRange,
      description,
      diseases: diseases?.map((d) => d.trim()).filter(Boolean) || [],
      treatmentType,
      contact,
      photos: photos || [],
      proof,
      status: "pending",
      createdBy: req.user._id
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || service.status !== "approved") {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
