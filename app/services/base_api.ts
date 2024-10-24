import axios, { AxiosError } from "axios";
import { DataAccount } from "../component/modal/modalBankAccount";

const apiClient = axios.create({
  baseURL: "https://apiweb.bankings.vnrsoftware.vn",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm để lấy danh sách tài khoản ngân hàng
export const fetchBankAccounts = async (
  pageIndex: number,
  pageSize: number
) => {
  try {
    const response = await apiClient.get(`/bank-account-api/find`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize,
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
  
