import { SettingsModal } from "../app/settings/page";
import { apiClient } from "./base_api";

export const getSettings = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.get(`/site-setting-api/find`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const editSettings = async (settings: SettingsModal) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.post(`/site-setting-api/update`, settings, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding or updating:", error);
    throw error;
  }
};
