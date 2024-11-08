import { ListSheetIntegration } from "../pages/sheet_intergration/page";
import { buildSearchParams } from "../pages/utils/buildQueryParams";
import { apiClient } from "./base_api";

export const getListSheetIntergration = async (
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
    const res = await apiClient.get(`/sheet-api/map/find`, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const addSheetIntergration = async (sheet: ListSheetIntegration) => {
  try {
    const res = await apiClient.post(`/sheet-api/map/add-or-update`, sheet);
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
