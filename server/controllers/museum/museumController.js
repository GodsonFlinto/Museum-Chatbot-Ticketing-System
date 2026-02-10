import Museum from "../../models/Museum.js";

/* USER */
export const getAllMuseums = async (req, res) => {
  const museums = await Museum.find();
  res.json(museums);
};

export const getMuseumById = async (req, res) => {
  const museum = await Museum.findById(req.params.id);
  res.json(museum);
};

/* ADMIN */
export const createMuseum = async (req, res) => {
  const museum = new Museum(req.body);
  await museum.save();
  res.status(201).json(museum);
};

export const updateMuseum = async (req, res) => {
  const updated = await Museum.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

export const deleteMuseum = async (req, res) => {
  await Museum.findByIdAndDelete(req.params.id);
  res.json({ msg: "Museum deleted" });
};


/* ================= ADMIN ================= */

/* ADD NEW MUSEUM */
export const addMuseumAdmin = async (req, res) => {
  try {
    const museum = new Museum(req.body);
    await museum.save();
    res.status(201).json(museum);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add museum" });
  }
};

/* GET ALL MUSEUMS (ADMIN) */
export const getAllMuseumsAdmin = async (req, res) => {
  try {
    const museums = await Museum.find();
    res.json(museums);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch museums" });
  }
};

/* UPDATE MUSEUM (ADMIN) */
export const updateMuseumAdmin = async (req, res) => {
  try {
    const updated = await Museum.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update museum" });
  }
};

/* DELETE MUSEUM (ADMIN) */
export const deleteMuseumAdmin = async (req, res) => {
  try {
    await Museum.findByIdAndDelete(req.params.id);
    res.json({ msg: "Museum deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete museum" });
  }
};

