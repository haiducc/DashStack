"use client";

import React, { useEffect, useState } from "react";
import { Select, Space, DatePicker, Table } from "antd";
import type { TableProps } from "antd/es/table";
import Header from "@/app/component/Header";
import BarChart from "../products/BarChart";
import Statistics from "../products/Statistics";
import {
  getListStatistics,
  getTransactionById,
} from "@/app/services/statistics";
import BaseModal from "@/app/component/config/BaseModal";

interface DataType {
  id: number;
  bankName: string;
  bankAccount: number;
  transDateString: Date;
  fullName: string;
  transAmount: number;
  narrative: string;
  transType: string;
  currentBalance: number;
  logStatus: string;
}

interface LogEntry {
  chatName?: string;
  sheetName?: string;
  logMessage?: string;
  createdDate: string;
  logMessageDescription: string;
}

interface Transaction {
  id: number;
  bankAccountId: number;
  groupChatId: number;
  transDate: string;
  transAmount: number;
  fullName: string;
  narrative: string;
  balanceBeforeTrans: number;
  currentBalance: number;
  transType: string;
  transDateString: string;
  logMessageDescription: string;
  transTypeDescription: string;
}

interface TransactionData {
  logChatSqlRes: LogEntry[];
  logSheetSqlRes: LogEntry[];
  transaction: Transaction;
}

const Dashboard = () => {
  const [, setSelectedOptions] = useState({
    accountType: "",
    transactionType: "",
    accountGroup: "",
  });
  const { RangePicker } = DatePicker;
  const [dataStatistics, setDataStatistics] = useState<DataType[]>([]);
  const [dataTransaction, setDataTransaction] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchListStatistics = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await getListStatistics(1, 20);
      console.log(response);

      const formattedData =
        response?.data?.source?.map((x: DataType) => ({
          id: x.id,
          bankName: x.bankName,
          bankAccount: x.bankAccount,
          transDateString: x.transDateString,
          fullName: x.fullName,
          transAmount: x.transAmount,
          narrative: x.narrative,
          transType: x.transType,
          currentBalance: x.currentBalance,
          logStatus: x.logStatus,
        })) || [];
      setDataStatistics(formattedData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchListStatistics();
  }, []);

  const fetchStatisticsById = async (id: number) => {
    try {
      const response = await getTransactionById(id);
      console.log("Transaction data:", response?.data);
      setDataTransaction(response?.data);
    } catch (error) {
      console.error("Error fetching transaction by id:", error);
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    { title: "Id", dataIndex: "id", key: "id" },
    { title: "Ngân hàng", dataIndex: "bankName", key: "bankName" },
    { title: "TK ngân hàng", dataIndex: "bankAccount", key: "bankAccount" },
    {
      title: "Ngày giao dịch",
      dataIndex: "transDateString",
      key: "transDateString",
    },
    {
      title: "Chủ tài khoản",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số tiền",
      dataIndex: "transAmount",
      key: "transAmount",
      render: (amount: number) => new Intl.NumberFormat("vi-VN").format(amount),
    },
    { title: "Nội dung CK", dataIndex: "narrative", key: "narrative" },
    {
      title: "Loại giao dịch",
      dataIndex: "transType",
      key: "transType",
      render: (type: string) => {
        const className = type === "3" ? "text-green-500" : "text-red-500";
        const label = type === "3" ? "Tiền vào" : "Tiền ra";

        return <div className={`font-bold ${className}`}>{label}</div>;
      },
    },
    {
      title: "Số dư",
      dataIndex: "currentBalance",
      key: "currentBalance",
      render: (balance: number) =>
        new Intl.NumberFormat("vi-VN").format(balance),
    },
    {
      title: "Trạng thái",
      dataIndex: "logStatus",
      key: "logStatus",
      render: (status: string, record: DataType) => (
        <div
          className={`text-white flex items-center justify-center rounded-md font-bold w-[93px] h-[27px] cursor-pointer ${
            status === "1" ? "bg-green-500" : "bg-red-500"
          }`}
          onClick={() => {
            fetchStatisticsById(record.id);
            showModal();
          }}
        >
          {status === "1" ? "Thành công" : "Giao dịch lỗi"}
        </div>
      ),
    },
  ];

  const options = [
    { key: "accountType", value: "company", label: "Tài khoản công ty" },
    { key: "accountType", value: "bank", label: "Tài khoản ngân hàng" },
    { key: "accountGroup", value: "telegram", label: "Nhóm chat Telegram" },
    { key: "transactionType", value: "transaction", label: "Loại giao dịch" },
    { key: "accountGroup", value: "accountGroup", label: "Nhóm tài khoản" },
  ];

  const handleChange = (key: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        <Header />
        <div className="dashboard mt-7">
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 3 }}>
              <BarChart />
            </div>
            <div style={{ flex: 1 }}>
              <Statistics />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-7">
          <Space direction="horizontal" size="middle">
            {options.map((option) => (
              <Select
                key={option.value}
                options={options.filter((opt) => opt.key === option.key)}
                placeholder={option.label}
                onChange={(value) => handleChange(option.key, value)}
                style={{ width: 245 }}
              />
            ))}
            <RangePicker />
          </Space>
        </div>
        <div className="mt-5 mx-[35px]">
          <Table<DataType>
            columns={columns}
            dataSource={dataStatistics}
            loading={loading} 
          />
        </div>
      </div>
      <BaseModal
        title="Chi tiết giao dịch"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        offPadding
      >
        <div className="w-full">
          <div className="text-red-500 text-2xl pb-2">
            -{" "}
            {new Intl.NumberFormat("vi-VN", {
              currency: "VND",
            }).format(dataTransaction?.transaction?.transAmount || 0)}
          </div>
          <div className="font-bold flex py-1">
            Tài khoản:{" "}
            <div className="font-normal pl-1">
              {dataTransaction?.transaction?.fullName}
            </div>
          </div>
          <div className="font-bold flex py-1">
            Nội dung:{" "}
            <div className="pl-2 font-normal">
              {dataTransaction?.transaction?.narrative}
            </div>
          </div>
          <div className="font-bold flex py-1">
            Số dư:
            <div className="pl-2 font-normal">
              {new Intl.NumberFormat("vi-VN", {
                currency: "VND",
              }).format(dataTransaction?.transaction?.currentBalance || 0)}
            </div>
          </div>
          <div className="font-bold flex py-1">
            Trạng thái:
            <div className="pl-2 font-normal">
              {dataTransaction?.transaction?.logMessageDescription}
            </div>
          </div>
          <div className="font-bold flex py-1">
            Ngày giao dịch:
            <div className="pl-2 font-normal">
              {dataTransaction?.transaction?.transDateString}
            </div>
          </div>
        </div>
      </BaseModal>
    </>
  );
};

export default Dashboard;
