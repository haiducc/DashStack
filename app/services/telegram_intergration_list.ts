import { ListTelegramIntegration } from "../pages/telegram_integration/page";
import { apiClient } from "./base_api";

export const getListTelegramIntergration = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const res = await apiClient.get(`/group-chat-api/map/find`, {
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

export const addTelegramIntergration = async (tele: ListTelegramIntegration) => {
  try {
    const res = await apiClient.post(`/group-chat-api/map/add-or-update`, tele);
    return res.data;
  } catch (error) {
    console.error("Error adding or updating:", error);
    throw error;
  }
};

export const deleteTelegramIntergration = async (id: number) => {
  try {
    const res = await apiClient.get(`/group-chat-api/map/delete`, {
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