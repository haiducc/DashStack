import { dataTelegramModal } from "../pages/telegram/page";
import { buildSearchParams } from "../pages/utils/buildQueryParams";
import { apiClient } from "./base_api";

export const getListTelegram = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string,
  searchTerms: Array<{ Name: string; Value: string }> = []
) => {
  try {
    const params = buildSearchParams(searchTerms, {
      pageIndex,
      pageSize,
      globalTerm: globalTerm || undefined,
    });
    const res = await apiClient.get(`/group-chat-api/find`, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const addTelegram = async (tele: dataTelegramModal) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.post(`/group-chat-api/add-or-update`, tele, {
      timeout: 30000,
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
