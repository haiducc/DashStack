import { ListSheetIntegration } from "../pages/sheet_intergration/page";
import { apiClient } from "./base_api";

export const getListSheetIntergration = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const res = await apiClient.get(`/sheet-api/map/find`, {
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

export const addSheetIntergration = async (sheet: ListSheetIntegration) => {
  try {
    const res = await apiClient.post(
      `/group-chat-api/map/add-or-update`,
      sheet
    );
    return res.data;
  } catch (error) {
    console.error("Error adding or updating:", error);
    throw error;
  }
};

export const deleteSheetIntergration = async (id: number) => {
  try {
    const res = await apiClient.get(`/sheet-api/map/delete`, {
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
