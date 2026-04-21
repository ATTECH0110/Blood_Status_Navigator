const router = require("express").Router();
const Hospital = require("../models/Hospital");
const sendSMS = require("../utils/sendSMS");
const sendEmail = require("../utils/sendEmail");
const authMiddleware = require("../middleware/authMiddleware");

/* ======================================================
   📌 CREATE NEW BLOOD REQUEST (PUBLIC)
====================================================== */
router.post("/:hospitalId", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId);

    if (!hospital) {
      return res.status(404).json({ msg: "Hospital not found" });
    }

    const { name, email, phone, bloodGroup, units } = req.body;

    if (!name || !phone || !bloodGroup || !units) {
      return res.status(400).json({ msg: "All required fields are missing" });
    }

    const newRequest = {
      name,
      email,
      phone,
      bloodGroup: bloodGroup.trim().toUpperCase(), // 🔥 normalize
      units: Number(units),
      status: "Pending",
    };

    hospital.requests.push(newRequest);
    await hospital.save();

    // ✅ SMS (safe)
    try {
      await sendSMS(
        phone,
        `Hello ${name},
Your blood request (${bloodGroup}, ${units} units)
has been sent to ${hospital.name}.`
      );
    } catch (err) {
      console.log("SMS error:", err.message);
    }

    // 🔥 realtime update
    const io = req.app.get("io");
    if (io) io.emit("data-updated");

    res.status(201).json({
      success: true,
      message: "Request sent successfully",
    });
  } catch (err) {
    console.error("Create request error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   📌 APPROVE / REJECT REQUEST (ADMIN ONLY)
====================================================== */
router.patch("/:hospitalId/:requestId", authMiddleware, async (req, res) => {
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

    const oldStatus = request.status;
    const bg = request.bloodGroup.trim().toUpperCase();

    console.log("==== APPROVE DEBUG ====");
    console.log("Hospital:", hospital.name);
    console.log("Blood Group:", bg);
    console.log("Units:", request.units);
    console.log("Old Status:", oldStatus);
    console.log("New Status:", status);
    console.log("Stock Before:", hospital.bloodStock[bg]);

    request.status = status;

    /* ================= STOCK REDUCE ================= */
    if (status === "Approved" && oldStatus !== "Approved") {
      if (hospital.bloodStock[bg] !== undefined) {
        hospital.bloodStock[bg] =
          Number(hospital.bloodStock[bg]) - Number(request.units);

        if (hospital.bloodStock[bg] < 0) {
          hospital.bloodStock[bg] = 0;
        }
      }
    }

    console.log("Stock After:", hospital.bloodStock[bg]);

    await hospital.save();

    /* ================= EMAIL ON APPROVAL ================= */
    if (status === "Approved" && request.email) {
      const mapLink = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}&travelmode=driving`;

      const htmlMessage = `
        <h2 style="color:#16a34a;">Blood Request Approved ✅</h2>

        <p>Hello <b>${request.name}</b>,</p>

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
            style="display:inline-block;padding:10px 15px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;">
            📍 Open Route in Google Maps
          </a>
        </p>

        <p>Please contact hospital before visiting.</p>
      `;

      try {
        await sendEmail(
          request.email,
          "Blood Request Approved",
          htmlMessage
        );
      } catch (err) {
        console.log("Email error:", err.message);
      }
    }

    /* ================= EMAIL ON REJECT ================= */
    if (status === "Rejected" && request.email) {
      const rejectMsg = `
        Hello ${request.name},

Your blood request (${request.bloodGroup}, ${request.units})
at ${hospital.name} was REJECTED.

Please try another hospital.
      `;

      try {
        await sendEmail(
          request.email,
          "Blood Request Rejected",
          rejectMsg
        );
      } catch (err) {
        console.log("Reject email error:", err.message);
      }
    }

    /* ================= REALTIME ================= */
    const io = req.app.get("io");
    if (io) io.emit("data-updated");

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      updatedStock: hospital.bloodStock[bg],
    });
  } catch (err) {
    console.error("PATCH error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   📌 DELETE REQUEST (ADMIN ONLY)
====================================================== */
router.delete("/:hospitalId/:requestId", authMiddleware, async (req, res) => {
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

    const io = req.app.get("io");
    if (io) io.emit("data-updated");

    res.json({ success: true, message: "Request deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;