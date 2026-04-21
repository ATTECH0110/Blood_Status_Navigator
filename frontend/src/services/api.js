import axios from "axios";

export default axios.create({
  baseURL: "https://blood-status-tracker.onrender.com/api",
});
