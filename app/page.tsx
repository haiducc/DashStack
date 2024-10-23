"use client";
import React, { useState } from "react";
import Header from "./component/Header";
import { Select, Space, DatePicker, Table, Row, Col, Card } from "antd";
import type { TableProps } from "antd/es/table";
import "./globals.css";

interface CardData {
  title: string;
  value: number;
  change: string;
  backgroundColor: string;
}

interface DataType {
  key: string;
  bank: string;
  bank_account: number;
  date: Date;
  account_holder: string;
  amount: number;
  content: string;
  type: string;
  balance: number;
  status: string;
}

const { RangePicker } = DatePicker;

const cardData: CardData[] = [
  {
    title: "Lợi Nhuận",
    value: 40689,
    change: "8.5% Ngày hôm qua",
    backgroundColor: "#67B173",
  },
  {
    title: "Tổng số tiền vào",
    value: 40689,
    change: "8.5% Ngày hôm qua",
    backgroundColor: "#29BADB",
  },
  {
    title: "Tổng số tiền ra",
    value: 40689,
    change: "8.5% Ngày hôm qua",
    backgroundColor: "#F17171",
  },
  {
    title: "Tổng số giao dịch vào",
    value: 40689,
    change: "8.5% Ngày hôm qua",
    backgroundColor: "#3D78E3",
  },
  {
    title: "Tổng số giao dịch ra",
    value: 40689,
    change: "8.5% Ngày hôm qua",
    backgroundColor: "#B16798",
  },
  {
    title: "Số dư hiện tại",
    value: 40689,
    change: "8.5% Ngày hôm qua",
    backgroundColor: "#8667B1",
  },
];

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Ngân hàng",
    dataIndex: "bank",
    key: "bank",
  },
  {
    title: "TK ngân hàng",
    dataIndex: "bank_account",
    key: "bank_account",
  },
  {
    title: "Ngày giao dịch",
    dataIndex: "date",
    key: "date",
    render: (date: Date) =>
      new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date),
  },
  {
    title: "Chủ tài khoản",
    dataIndex: "account_holder",
    key: "account_holder",
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number) => new Intl.NumberFormat("vi-VN").format(amount),
  },
  {
    title: "Nội dung CK",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "Loại giao dịch",
    dataIndex: "type",
    key: "type",
    render: (type: string) => (
      <div
        className={`font-bold ${
          type === "Tiền ra" ? "text-red-500" : "text-green-500"
        }`}
      >
        {type}
      </div>
    ),
  },
  {
    title: "Số dư",
    dataIndex: "balance",
    key: "balance",
    render: (balance: number) => new Intl.NumberFormat("vi-VN").format(balance),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <div
        className={`text-white flex items-center justify-center rounded-md font-bold w-[93px] h-[27px] ${
          status === "Thành công" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {status}
      </div>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    bank: "MB",
    bank_account: 123123123123,
    account_holder: "NHD",
    date: new Date("2024-10-22"),
    amount: 10000000000,
    content: "ALO ALO",
    type: "Tiền ra",
    balance: 10000,
    status: "Thành công",
  },
];

const options = [
  { value: "company", label: "Tài khoản công ty" },
  { value: "bank", label: "Tài khoản ngân hàng" },
  { value: "telegram", label: "Nhóm chat Telegram" },
  { value: "transaction", label: "Loại giao dịch" },
  { value: "accountGroup", label: "Nhóm tài khoản" },
];

const Page = () => {
  const [, setSelectedOptions] = useState({
    accountType: "",
    transactionType: "",
    accountGroup: "",
  });

  const handleChange = (key: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div>
      <Header />
      <div className="dashboard mt-7">
        <Row gutter={[16, 16]} justify="center">
          {cardData.map((card, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={4}>
              <Card
                style={{ backgroundColor: card.backgroundColor }}
                bodyStyle={{ padding: 20, textAlign: "center" }}
                bordered={false}
              >
                <div>
                  <h3 className="text-white">{card.title}</h3>
                  <h2 className="text-white">{card.value.toLocaleString("vi-VN")}</h2>
                  <div className="text-white">{card.change}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <div className="flex justify-center mt-7">
        <Space direction="horizontal" size="middle">
          {["Tài khoản công ty", "Tài khoản ngân hàng", "Nhóm chat Telegram", "Loại giao dịch", "Nhóm tài khoản"].map(
            (placeholder, index) => (
              <Select
                key={index}
                options={options}
                placeholder={placeholder}
                onChange={(value) => handleChange(placeholder, value)}
                style={{ width: 245 }}
              />
            )
          )}
          <RangePicker />
        </Space>
      </div>
      <div className="mt-5 mx-[35px]">
        <Table<DataType>
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Page;
