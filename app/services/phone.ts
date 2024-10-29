import { PhoneNumberModal } from "../pages/phone_number/page";
import { apiClient } from "./base_api";

export const getListPhone = async (pageIndex: number, pageSize: number, globalTerm?: string) => {
  try {
    const res = await apiClient.get(`/phone-api/find`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        globalTerm:globalTerm
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const addPhoneNumber = async (phoneData: PhoneNumberModal) => {
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

export const deletePhone = async (id: number) => {
  try {
    const res = await apiClient.get(`/phone-api/delete`, {
      params: {
        id: id,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};