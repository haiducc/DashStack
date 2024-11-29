import { DataSystemModal } from "../app/group_system/page";
import { buildSearchParams } from "../utils/buildQueryParams";
import { apiClient } from "./base_api";

export const getGroupSystem = async (
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
    const res = await apiClient.get(`/group-system-api/find`, {
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

export const addGroupSystem = async (system: DataSystemModal) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.post(
      `/group-system-api/add-or-update`,
      system,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding or updating:", error);
    throw error;
  }
};

export const deleteGroupSystem = async (ids: number[]) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.post(
      `/group-system-api/delete`,
      ids,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};
