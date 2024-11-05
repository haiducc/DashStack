import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://apiweb.bankings.vnrsoftware.vn",
  // baseURL: "http://localhost:5247",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
