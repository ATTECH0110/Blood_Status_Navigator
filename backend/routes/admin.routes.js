const express = require("express");
const Hospital = require("../models/Hospital");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   ADMIN STATS (ONLY OWN DATA)
========================= */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const adminId = req.admin.id;

    // Only this admin's hospitals
    const hospitals = await Hospital.find({ adminId });

    const totalHospitals = hospitals.length;

    let totalRequests = 0;
    let pending = 0;
    let approved = 0;

    hospitals.forEach((hospital) => {
      if (Array.isArray(hospital.requests)) {
        totalRequests += hospital.requests.length;

        hospital.requests.forEach((reqItem) => {
          if (reqItem.status === "Pending") pending++;
          if (reqItem.status === "Approved") approved++;
        });
      }
    });

    res.json({
      totalHospitals,
      totalRequests,
      pending,
      approved,
      hospitals,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   DELETE REQUEST (ONLY OWN DATA)
========================= */
router.delete("/delete-request/:id", authMiddleware, async (req, res) => {
  try {
    const adminId = req.admin.id;

    const hospital = await Hospital.findOne({
      adminId,
      "requests._id": req.params.id,
    });

    if (!hospital) {
      return res.status(404).json({ msg: "Request not found" });
    }

    hospital.requests = hospital.requests.filter(
      (r) => r._id.toString() !== req.params.id
    );

    await hospital.save();

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error("Delete request error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;