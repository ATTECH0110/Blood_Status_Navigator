const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Hospital = require("../models/Hospital");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

/* =========================
   PUBLIC - GET ALL HOSPITALS
   USER MAP KE LIYE
========================= */
router.get("/public", async (req, res) => {
  try {
    const hospitals = await Hospital.find(
      {},
      {
        name: 1,
        address: 1,
        phone: 1,
        latitude: 1,
        longitude: 1,
        bloodStock: 1,
      }
    ).sort({ createdAt: -1 });

    res.json(hospitals);
  } catch (err) {
    console.error("Public hospitals fetch error:", err);
    res.status(500).json({ msg: "Failed to fetch hospitals" });
  }
});

/* =========================
   ADD HOSPITAL (ADMIN ONLY)
========================= */
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, address, phone, latitude, longitude, bloodStock } = req.body;

    if (!name || !address || latitude === "" || longitude === "") {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newHospital = await Hospital.create({
      adminId: req.admin.id,
      name,
      address,
      phone,
      latitude,
      longitude,
      bloodStock,
    });

    res.status(201).json({
      msg: "Hospital added successfully",
      hospital: newHospital,
    });
  } catch (err) {
    console.error("Add hospital error:", err);
    res.status(500).json({ msg: "Failed to add hospital" });
  }
});

/* =========================
   GET ONLY LOGGED-IN ADMIN HOSPITALS
========================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const hospitals = await Hospital.find({
      adminId: new mongoose.Types.ObjectId(req.admin.id),
    }).sort({ createdAt: -1 });

    res.json(hospitals);
  } catch (err) {
    console.error("Fetch hospitals error:", err);
    res.status(500).json({ msg: "Failed to fetch hospitals" });
  }
});

/* =========================
   GET ALL REQUESTS OF LOGGED-IN ADMIN
========================= */
router.get("/all-requests", authMiddleware, async (req, res) => {
  try {
    const hospitals = await Hospital.find({
      adminId: new mongoose.Types.ObjectId(req.admin.id),
    });

    let allRequests = [];

    hospitals.forEach((hospital) => {
      (hospital.requests || []).forEach((reqItem) => {
        allRequests.push({
          _id: reqItem._id,
          hospitalId: hospital._id,
          hospitalName: hospital.name,
          hospitalPhone: hospital.phone || "",
          hospitalAddress: hospital.address || "",
          hospitalLatitude: hospital.latitude,
          hospitalLongitude: hospital.longitude,
          name: reqItem.name,
          email: reqItem.email,
          phone: reqItem.phone,
          bloodGroup: reqItem.bloodGroup,
          units: reqItem.units,
          status: reqItem.status,
          createdAt: reqItem.createdAt,
        });
      });
    });

    allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allRequests);
  } catch (err) {
    console.error("Fetch requests error:", err);
    res.status(500).json({ msg: "Failed to fetch requests" });
  }
});

/* =========================
   UPDATE REQUEST STATUS
========================= */
router.patch("/request/:hospitalId/:requestId", authMiddleware, async (req, res) => {
  try {
    const { hospitalId, requestId } = req.params;
    const { status } = req.body;

    const hospital = await Hospital.findOne({
      _id: hospitalId,
      adminId: req.admin.id,
    });

    if (!hospital) {
      return res.status(404).json({ msg: "Hospital not found" });
    }

    const request = hospital.requests.id(requestId);

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // 🔥 OLD STATUS yaad rakho
    const oldStatus = request.status;

    // 🔥 update status
    request.status = status;

    // ===============================
    // ✅ STOCK REDUCE ONLY ON FIRST APPROVAL
    // ===============================
    if (status === "Approved" && oldStatus !== "Approved") {
      if (hospital.bloodStock[request.bloodGroup] !== undefined) {
        hospital.bloodStock[request.bloodGroup] -= request.units;

        if (hospital.bloodStock[request.bloodGroup] < 0) {
          hospital.bloodStock[request.bloodGroup] = 0;
        }
      }
    }

    await hospital.save();

    // ================= SEND MAIL ON APPROVAL =================
    if (status === "Approved" && request.email) {
      const mapLink = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}&travelmode=driving`;

      const htmlMessage = `
        <h2 style="color:#dc2626;">Blood Request Approved ✅</h2>
        <p>Hello <b>${request.name || "User"}</b>,</p>
        <p>Your blood request has been <b style="color:green;">APPROVED</b>.</p>

        <h3>Hospital Details:</h3>
        <ul>
          <li><b>Hospital Name:</b> ${hospital.name}</li>
          <li><b>Address:</b> ${hospital.address}</li>
          <li><b>Phone:</b> ${hospital.phone || "Not Available"}</li>
          <li><b>Blood Group:</b> ${request.bloodGroup}</li>
          <li><b>Units:</b> ${request.units}</li>
        </ul>

        <p>
          <a href="${mapLink}" target="_blank" 
             style="display:inline-block;padding:10px 16px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;">
             Open Route in Google Maps
          </a>
        </p>

        <p>Please contact the hospital before visiting.</p>
        <br/>
        <p>Regards,<br/><b>Blood Status System</b></p>
      `;

      await sendEmail(
        request.email,
        "Blood Request Approved - Hospital Details",
        htmlMessage
      );
    }

    // ================= SEND MAIL ON REJECTION =================
    if (status === "Rejected" && request.email) {
      const rejectMessage = `
        <h2 style="color:#dc2626;">Blood Request Rejected ❌</h2>
        <p>Hello <b>${request.name || "User"}</b>,</p>
        <p>Your blood request for <b>${request.bloodGroup}</b> (${request.units} units)
        at <b>${hospital.name}</b> has been <b style="color:red;">REJECTED</b>.</p>

        <p>Please try another hospital.</p>
        <br/>
        <p>Regards,<br/><b>Blood Status System</b></p>
      `;

      await sendEmail(
        request.email,
        "Blood Request Rejected",
        rejectMessage
      );
    }

    // 🔥 REALTIME UPDATE
    const io = req.app.get("io");
    if (io) {
      io.emit("data-updated");
    }

    res.json({ msg: `Request ${status} successfully`, hospital });
  } catch (err) {
    console.error("Update request error:", err);
    res.status(500).json({ msg: "Failed to update request" });
  }
});

/* =========================
   DELETE REQUEST
========================= */
router.delete("/request/:hospitalId/:requestId", authMiddleware, async (req, res) => {
  try {
    const { hospitalId, requestId } = req.params;

    const hospital = await Hospital.findOne({
      _id: hospitalId,
      adminId: req.admin.id,
    });

    if (!hospital) {
      return res.status(404).json({ msg: "Hospital not found" });
    }

    const request = hospital.requests.id(requestId);

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    hospital.requests.pull(requestId);
    await hospital.save();

    res.json({ msg: "Request deleted successfully" });
  } catch (err) {
    console.error("Delete request error:", err);
    res.status(500).json({ msg: "Failed to delete request" });
  }
});

module.exports = router;