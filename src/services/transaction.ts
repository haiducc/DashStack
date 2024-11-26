import { TransactionModal } from "../app/transaction/page";
import { buildSearchParams } from "../utils/buildQueryParams";
import { apiClient } from "./base_api";

export const getTransaction = async (
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
    const res = await apiClient.get(`/transaction-api/manual/find`, {
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

// id: item.id?.toString() || Date.now().toString(), // id
// bankName: item.bankName, // Mã ngân hàng
// bankAccount: item.bankAccount, // stk
// fullName: item.fullName, // tên chủ tk
// transDateString: item.transDateString, // Ngày giao dịch
// transType: item.transType, // Giao dịch
// purposeDescription: item.purposeDescription, // Mục đích
// reason: item.reason, // lý do
// balanceBeforeTrans: item.balanceBeforeTrans, // Số dư
// currentBalance: item.currentBalance, // số dư hiện tại
// notes: item.notes, // ghi chú

export const addTransaction = async (trans: TransactionModal) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.post(`/transaction-api/manual/update`, trans, {
      timeout: 30000,
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

export const deleteTransaction = async (id: number) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.get(`/transaction-api/manual/delete`, {
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
