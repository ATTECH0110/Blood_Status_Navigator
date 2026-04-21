const router = require("express").Router();
const Contact = require("../models/Contact");

/* =========================
   SAVE CONTACT MESSAGE
========================= */
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    res.json({ msg: "Message saved successfully" });
  } catch (err) {
    console.error("Contact save error:", err);
    res.status(500).json({ msg: "Failed to save message" });
  }
});

/* =========================
   GET ALL CONTACT MESSAGES
========================= */
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error("Fetch contact error:", err);
    res.status(500).json({ msg: "Failed to fetch contacts" });
  }
});

module.exports = router;