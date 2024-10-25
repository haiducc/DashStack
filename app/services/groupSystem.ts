import { apiClient } from "./base_api";

export const getGroupSystem = async (pageIndex: number, pageSize: number) => {
  try {
    const res = await apiClient.get(`/group-system-api/find`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};
