"use client";

import React, { useEffect, useState } from "react";
import { Select, Space, DatePicker, Table } from "antd";
import type { TableProps } from "antd/es/table";
// import "./globals.css";
import Header from "@/app/component/Header";
import BarChart from "../products/BarChart";
import Statistics from "../products/Statistics";
import { getListStatistics } from "@/app/services/statistics";
import BaseModal from "@/app/component/config/BaseModal";

interface DataType {
  id: string;
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

const Dashboard = () => {
  const [, setSelectedOptions] = useState({
    accountType: "",
    transactionType: "",
    accountGroup: "",
  });
  const { RangePicker } = DatePicker;
  const [dataStatistics, setDataStatistics] = useState([]);

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
      render: (status: string) => (
        <div
          className={`text-white flex items-center justify-center rounded-md font-bold w-[93px] h-[27px] cursor-pointer ${
            status === "1" ? "bg-green-500" : "bg-red-500"
          }`}
          onClick={showModal}
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

  const fetchListStatistics = async () => {
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
      console.error("Error fetching phone numbers:", error);
    }
  };

  useEffect(() => {
    fetchListStatistics();
  }, []);

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
          <Table<DataType> columns={columns} dataSource={dataStatistics} />
        </div>
      </div>
      <BaseModal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        offPadding
      >
        <p>Some contentqưeqweqwe123123s...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </BaseModal>
    </>
  );
};

export default Dashboard;
