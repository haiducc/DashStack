"use client";

import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "@/app/component/Header";
import { Button, Input, Select, Space, Spin, Table } from "antd";
import { getTransaction } from "@/app/services/transaction";

export interface TransactionModal {
  id: number;
  bankName: string;
  bankAccount: string;
  fullName: string;
  transDateString: string;
  transType: string;
  purposeDescription: string;
  reason: string;
  balanceBeforeTrans: number;
  currentBalance: number;
  notes: string;
}

const Transaction = () => {
  const [loading, setLoading] = useState(false);
  const [dataTransaction, setDataTransaction] = useState<TransactionModal[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [globalTerm, setGlobalTerm] = useState("");

  const fetchTransaction = async (globalTerm = "") => {
    setLoading(true);
    try {
      const response = await getTransaction(1, 50, globalTerm);
      console.log(response, "transaction");
      const formattedData =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response?.data?.source?.map((item: any) => ({
          id: item.id?.toString() || Date.now().toString(), // id
          bankName: item.bankName, // Mã ngân hàng
          bankAccount: item.bankAccount, // stk
          fullName: item.fullName, // tên chủ tk
          transDateString: item.transDateString, // Ngày giao dịch
          transType: item.transType, // Giao dịch
          purposeDescription: item.purposeDescription, // Mục đích
          reason: item.reason, // lý do
          balanceBeforeTrans: item.balanceBeforeTrans, // Số dư
          currentBalance: item.currentBalance, // số dư hiện tại
          notes: item.notes, // ghi chú
        })) || [];
      setDataTransaction(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction(globalTerm);
  }, [globalTerm]);

  const columns = [
    // {
    //   title: "bankAccountId",
    //   dataIndex: "bankAccountId",
    //   key: "bankAccountId",
    // },
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Ngân hàng", dataIndex: "bankName", key: "bankName" },
    { title: "Số tài khoản", dataIndex: "bankAccount", key: "bankAccount" },
    { title: "Tên chủ tài khoản", dataIndex: "fullName", key: "fullName" },
    {
      title: "Ngày giao dịch",
      dataIndex: "transDateString",
      key: "transDateString",
    },
    { title: "Giao dịch", dataIndex: "transType", key: "transType" },
    {
      title: "Mục đích",
      dataIndex: "purposeDescription",
      key: "purposeDescription",
    },
    { title: "Lý do", dataIndex: "reason", key: "reason" },
    {
      title: "Số tiền",
      dataIndex: "balanceBeforeTrans",
      key: "balanceBeforeTrans",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (balance: any) => {
        const formattedBalance = Math.abs(balance).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        return balance ? `- ${formattedBalance}` : "0";
      },
    },
    {
      title: "Số dư hiện tại",
      dataIndex: "currentBalance",
      key: "currentBalance",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (balance: any) =>
        balance.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Chức năng",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (record: TransactionModal) => (
        <Space size="middle">
          <Button
            //   onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          >
            Chỉnh sửa
          </Button>
          <Button
            // onClick={() => handleDelete(record)}
            icon={<DeleteOutlined />}
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">
          Danh sách giao dịch thủ công
        </div>
        <div className="flex justify-between items-center mb-7">
          <div>
            <Input
              placeholder="Tìm kiếm số tài khoản ..."
              style={{
                width: 253,
                borderRadius: 10,
                height: 38,
                marginRight: 15,
              }}
              //   onChange={(e) => {
              //     const value = e.target.value;
              //     handleSearch(value);
              //   }}
              //   onPressEnter={async (e) => {
              //     handleSearch(e.currentTarget.value);
              //   }}
            />
            <Space direction="horizontal" size="middle">
              {["Nhóm telegram", "Loại giao dịch", "Tên ngân hàng"].map(
                (placeholder, index) => (
                  <Select
                    allowClear
                    key={index}
                    // options={accountGroup}
                    style={{ width: 245 }}
                    placeholder={placeholder}
                    // onChange={handleFilterChange}
                  />
                )
              )}
            </Space>
          </div>

          <Button
            className="bg-[#4B5CB8] w-[136px] h-[40px] text-white font-medium hover:bg-[#3A4A9D]"
            // onClick={() => {
            //   setCurrentSheet(null);
            //   form.resetFields();
            //   setAddModalOpen(true);
            // }}
          >
            Thêm mới
          </Button>
        </div>
        {loading ? (
          <Spin spinning={loading} />
        ) : (
          <Table columns={columns} dataSource={dataTransaction} rowKey="id" />
        )}
      </div>
    </>
  );
};

export default Transaction;
