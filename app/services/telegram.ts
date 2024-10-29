import { dataTelegramModal } from "../pages/telegram/page";
import { apiClient } from "./base_api";

export const getListTelegram = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const res = await apiClient.get(`/group-chat-api/find`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        globalTerm: globalTerm,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const addTelegram = async (tele: dataTelegramModal) => {
    try {
      const res = await apiClient.post(`/group-chat-api/add-or-update`, tele, {
        timeout: 30000,
      });
      return res.data;
    } catch (error) {
      console.error("Error adding or updating:", error);
      throw error;
    }
  };
  

export const deleteTelegram = async (id: number) => {
  try {
    const res = await apiClient.get(`/group-chat-api/delete`, {
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
