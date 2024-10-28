import { AxiosError } from "axios";
import { apiClient } from "./base_api";
import { DataAccount } from "../component/modal/modalBankAccount";

// Hàm để lấy danh sách tài khoản ngân hàng
export const fetchBankAccounts = async (
  pageIndex: number,
  pageSize: number,
  globalTerm?: string
) => {
  try {
    const response = await apiClient.get(`/bank-account-api/find`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        globalTerm: globalTerm || undefined
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching bank accounts:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};


// API thêm mới, cập nhật tài khoản ngân hàng
export const addBankAccounts = async (accountData: DataAccount) => {
  try {
    const res = await apiClient.post(
      `/bank-account-api/add-or-update`,
      accountData
    );
    return res.data;
  } catch (error) {
    console.error("Error adding or updating bank account:", error);
    throw error;
  }
};

export const getBank = async (pageIndex: number, pageSize: number) => {
  try {
    const res = await apiClient.get(`/bank-api/find`, {
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

export const deleteBankAccount = async (id: number) => {
  try {
    const res = await apiClient.get(`/bank-account-api/delete`, {
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