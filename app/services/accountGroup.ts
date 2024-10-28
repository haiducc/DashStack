import { apiClient } from "./base_api";

export const getAccountGroup = async (
  pageIndex: number,
  pageSize: number,
  searchTerms: string
) => {
  try {
    const res = await apiClient.get(`/group-account-api/find`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        searchTerms: searchTerms,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};
