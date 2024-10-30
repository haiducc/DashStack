import { dataSheetModal } from "../pages/sheet/page";
import { apiClient } from "./base_api";

export const getListSheet = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const res = await apiClient.get(`/sheet-api/find`, {
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

export const addSheet = async (tele: dataSheetModal) => {
  try {
    const res = await apiClient.post(`/sheet-api/add-or-update`, tele);
    return res.data;
  } catch (error) {
    console.error("Error adding or updating:", error);
    throw error;
  }
};

export const deleteSheet = async (id: number) => {
  try {
    const res = await apiClient.get(`sheet-api/delete`, {
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
