import { DataAccountGroup } from "../component/modal/modalAccountGroup";
import { buildSearchParams } from "../utils/buildQueryParams";
import { apiClient } from "./base_api";

export const getAccountGroup = async (
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
    const res = await apiClient.get(`/group-account-api/find`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("searchTerms :", searchTerms);

    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const addAccountGroup = async (accountGroup: DataAccountGroup) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.post(
      `/group-account-api/add-or-update`,
      accountGroup,
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

export const deleteAccountGroup = async (id: number) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.get(`/group-account-api/delete`, {
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
