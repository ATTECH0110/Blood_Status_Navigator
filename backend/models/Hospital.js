const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  bloodGroup: String,
  units: Number,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const hospitalSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    name: String,
    address: String,
    phone:String,

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    bloodStock: {
      "A+": Number,
      "A-": Number,
      "B+": Number,
      "B-": Number,
      "O+": Number,
      "O-": Number,
      "AB+": Number,
      "AB-": Number,
    },

    requests: [requestSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", hospitalSchema);