import { DataTeamModal } from "../app/group_team/page";
import { buildSearchParams } from "../utils/buildQueryParams";
import { apiClient } from "./base_api";

export const getGroupTeam = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string,
  searchTerms: Array<{ Name: string; Value: string }> = []
) => {
  try {
    console.log(globalTerm, searchTerms, "filter");

    const token = localStorage.getItem("accessToken");
    const params = buildSearchParams(searchTerms, {
      pageIndex,
      pageSize,
      globalTerm: globalTerm || undefined,
    });
    const res = await apiClient.get(`/group-team-api/find`, {
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

export const addGroupTeam = async (team: DataTeamModal) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.post(`/group-team-api/add-or-update`, team, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding or updating:", error);
    throw error;
  }
};

export const deleteGroupTeam = async (ids: number[]) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.post(`/group-team-api/delete`, ids, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};
