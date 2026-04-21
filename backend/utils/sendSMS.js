const axios = require("axios");

module.exports = async (phone, message) => {
  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: message,
        language: "english",
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
        },
      }
    );

    console.log("✅ SMS sent to", phone);
  } catch (error) {
    console.error("❌ SMS failed:", error.response?.data || error.message);
  }
};