import { DataPhoneNumber } from "../component/modal/modalPhoneNumber";
import { apiClient } from "./base_api";

export const getListPhone = async (pageIndex: number, pageSize: number) => {
  try {
    const res = await apiClient.get(`/phone-api/find`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const addPhoneNumber = async (phoneData: DataPhoneNumber) => {
  try {
    const res = await apiClient.post(
      `/phone-api/add-or-update`,
      phoneData
    );
    return res.data;
  } catch (error) {
    console.error("Error adding or updating:", error);
    throw error;
  }
};