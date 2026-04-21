const router = require("express").Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res.status(401).json({ msg: "Invalid email" });
    }

    if (!admin.isVerified) {
      return res.status(401).json({ msg: "Please verify your email first" });
    }

    const ok = await bcrypt.compare(req.body.password, admin.password);

    if (!ok) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

    res.json({ token, msg: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed" });
  }
});

/* =========================
   SEND OTP FOR SIGNUP
========================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, mobile, age, email, password } = req.body;

    if (!name || !mobile || !age || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existing = await Admin.findOne({ email });

    if (existing && existing.isVerified) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Admin.findOneAndUpdate(
      { email },
      {
        name,
        mobile,
        age,
        email,
        password: hash,
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000, // 5 min
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    await sendEmail(
      email,
      "Blood Status Admin OTP Verification",
      `Your OTP is ${otp}. It is valid for 5 minutes.`
    );

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Signup failed" });
  }
});

/* =========================
   VERIFY OTP
========================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (admin.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    admin.isVerified = true;
    admin.otp = null;
    admin.otpExpiry = null;

    await admin.save();

    res.json({ msg: "Admin verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "OTP verification failed" });
  }
});
/* =========================
   RESEND OTP
========================= */
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.otp = otp;
    admin.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await admin.save();

    await sendEmail(
      email,
      "Blood Status Admin OTP Verification",
      `Your new OTP is ${otp}. It is valid for 5 minutes.`
    );

    res.json({ msg: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Resend OTP failed" });
  }
});

/* =========================
   FORGOT PASSWORD (BASIC)
========================= */
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    res.json({ msg: "Reset link sent (demo)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;