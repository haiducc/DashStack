import { apiClient } from "./base_api";

export const getListStatistics = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const res = await apiClient.get(`/transaction-api/find-transaction`, {
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

export const getDetailCurentBalance = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const res = await apiClient.get(`/transaction-api/find-balance-account`, {
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

export const getDataGenaral = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const res = await apiClient.get(`/transaction-api/find-genaral`, {
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
