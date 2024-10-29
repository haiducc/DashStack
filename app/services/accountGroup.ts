import { DataAccountGroup } from "../component/modal/modalAccountGroup";
import { apiClient } from "./base_api";

export const getAccountGroup = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const res = await apiClient.get(`/group-account-api/find`, {
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


export const addAccountGroup = async (accountGroup: DataAccountGroup) => {
  try {
    const res = await apiClient.post(
      `/group-account-api/add-or-update`,
      accountGroup
    );
    return res.data;
  } catch (error) {
    console.error("Error adding or updating:", error);
    throw error;
  }
};

export const deleteAccountGroup = async (id: number) => {
  try {
    const res = await apiClient.get(`/group-account-api/delete`, {
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