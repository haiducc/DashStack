import { dataRole } from "../pages/role/page";
import { apiClient } from "./base_api";

export const getRole = async (pageIndex: number, pageSize: number, globalTerm?: string) => {
  try {
    const res = await apiClient.get(`/account/find`, {
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

export const addRole = async (phoneData: dataRole) => {
  try {
    const res = await apiClient.post(
      `/account/add-or-update`,
      phoneData
    );
    return res.data;
  } catch (error) {
    console.error("Error adding or updating:", error);
    throw error;
  }
};

export const deleteRole = async (id: number) => {
  try {
    const res = await apiClient.get(`/account/delete`, {
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