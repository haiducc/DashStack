
import { DataTelegramModal } from "../app/telegram/page";
import { buildSearchParams } from "../utils/buildQueryParams";
import { apiClient } from "./base_api";

export const getListTelegram = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string,
  searchTerms: Array<{ Name: string; Value: string }> = []
) => {
  try {
    const token = localStorage.getItem("accessToken");
    const params = buildSearchParams(searchTerms, {
      pageIndex,
      pageSize,
      globalTerm: globalTerm || undefined,
    });
    const res = await apiClient.get(`/group-chat-api/find`, {
      params,
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

export const addTelegram = async (tele: DataTelegramModal) => {
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
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.get(`/group-chat-api/delete`, {
      params: {
        id: id,
      },
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

export const getTransType = async (
  bankAccountId: number,
  groupId: number,
  id?: number
) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.get(`/group-chat-api/map/get-trans-type`, {
      params: { bankAccountId, groupId, id },
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
