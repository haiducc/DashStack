import { apiClient } from "./base_api";

export const getListTelegramIntergration = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const res = await apiClient.get(`/group-chat-api/map/find`, {
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
