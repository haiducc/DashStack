import { apiClient } from "./base_api";

export const getBranchSystem = async (grandparentId: number, pageIndex: number, pageSize: number) => {
  try {
    const res = await apiClient.get(`/group-branch-api/find`, {
      params: {
        grandparentId: grandparentId,
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
