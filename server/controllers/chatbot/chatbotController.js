import Chatbot from "../../models/Chatbot.js";

/* ================= ADMIN ================= */

/* GET ALL FAQ */
export const getAllFaqs = async (req, res) => {
  const faqs = await Chatbot.find();
  res.json(faqs);
};

/* ADD FAQ */
export const addFaq = async (req, res) => {
  const faq = new Chatbot(req.body);
  await faq.save();
  res.status(201).json(faq);
};

/* UPDATE FAQ */
export const updateFaq = async (req, res) => {
  const updated = await Chatbot.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

/* DELETE FAQ */
export const deleteFaq = async (req, res) => {
  await Chatbot.findByIdAndDelete(req.params.id);
  res.json({ msg: "FAQ deleted" });
};
