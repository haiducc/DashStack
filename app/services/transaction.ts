import { TransactionModal } from "../pages/transaction/page";
import { apiClient } from "./base_api";

export const getTransaction = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const res = await apiClient.get(`/transaction-api/manual/find`, {
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
    const res = await apiClient.post(`/transaction-api/manual/update`, trans);
    return res.data;
  } catch (error) {
    console.error("Error adding or updating:", error);
    throw error;
  }
};

export const deleteTransaction = async (id: number) => {
  try {
    const res = await apiClient.get(`/transaction-api/manual/delete`, {
      params: {
        id: id,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};