import { apiClient } from "./base_api";

export const getListPhone = async (pageIndex: number, pageSize: number) => {
  try {
    const res = await apiClient.get(`/phone-api/find`, {
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
