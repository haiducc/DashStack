import { apiClient } from "./base_api";

export const getGroupTeam = async (
  grandparentId: number,
  parentId: number,
  pageIndex: number,
  pageSize: number
) => {
  try {
    const res = await apiClient.get(`/group-team-api/find`, {
      params: {
        grandparentId: grandparentId,
        parentId: parentId,
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
