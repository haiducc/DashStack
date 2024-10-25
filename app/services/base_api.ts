import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://apiweb.bankings.vnrsoftware.vn",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
