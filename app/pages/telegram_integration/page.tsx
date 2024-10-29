"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/component/Header";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Input, Space, Spin, Table } from "antd";
import { getListTelegramIntergration } from "@/app/services/telegram_intergration_list";

export interface listTelegramIntergration {
  id: number;
  groupChatId: number;
  transType: string;
  bankAccount: {
    bankId: number;
    accountNumber: string;
    fullName: string;
  };
  groupChat: {
    id: number;
    name: string;
    chatId: string;
  };
  bank: {
    id: number;
    fullName: string;
    code: string;
    notes: string;
  };
  typeDescription: string;
}

const TelegramIntegration = () => {
  const [loading] = useState(false);
  const [dataTelegramIntergration, setDataTelegramIntergration] = useState<
    listTelegramIntergration[]
  >([]);
  const [pageIndex] = useState(1);
  const [pageSize] = useState(50);

  const fetchListTelegramIntergration = async (globalTerm = "") => {
    try {
      const response = await getListTelegramIntergration(
        pageIndex,
        pageSize,
        globalTerm
      );
      const formattedData =
        response?.data?.source?.map((x: listTelegramIntergration) => ({
          id: x.id?.toString() || Date.now().toString(),
          code: x.bank.code,
          accountNumber: x.bankAccount.accountNumber,
          fullName: x.bankAccount.fullName,
          chatId: x.groupChat.chatId,
          name: x.groupChat.name,
          transType: x.transType,
        })) || [];
      setDataTelegramIntergration(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchListTelegramIntergration();
  }, []);

  const columns = [
    { title: "id", dataIndex: "id", key: "id" },
    { title: "Ngân hàng", dataIndex: "code", key: "code" },
    { title: "Số tài khoản", dataIndex: "accountNumber", key: "accountNumber" },
    { title: "Tên chủ tài khoản", dataIndex: "fullName", key: "fullName" },
    { title: "ID nhóm telegram", dataIndex: "chatId", key: "chatId" },
    { title: "Tên nhóm telegram", dataIndex: "name", key: "name" },
    {
      title: "Loại giao dịch",
      dataIndex: "transType",
      key: "transType",
      render: (transType: string) => (
        <div>
          {transType === "1" ? (
            <div className="font-semibold text-[#0356B6]">Cả hai</div>
          ) : transType === "2" ? (
            <div className="font-semibold text-[#D40606]">Tiền ra</div>
          ) : (
            <div className="font-semibold text-[#01AF36]">Tiền vào</div>
          )}
        </div>
      ),
    },
    {
      title: "Chức năng",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (record: listTelegramIntergration) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            // onClick={() => handleEditTele(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            // onClick={() => handleDeleteTele(record)}
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
          Danh sách tích hợp telegram
        </div>
        <div className="flex justify-between items-center mb-7">
          <Input
            placeholder="Tìm kiếm ID tài khoản, tên nhóm chat ..."
            style={{
              width: 253,
              borderRadius: 10,
              height: 38,
              marginRight: 15,
            }}
            // onChange={(e) => {
            //   const value = e.target.value;
            //   handleSearch(value);
            // }}
            // onPressEnter={async (e) => {
            //   handleSearch(e.currentTarget.value);
            // }}
          />
          <Button
            className="bg-[#4B5CB8] w-[136px] h-[40px] text-white font-medium hover:bg-[#3A4A9D]"
            // onClick={() => {
            //   setCurrentTelegram(null);
            //   form.resetFields();
            //   setAddModalOpen(true);
            // }}
          >
            Thêm mới
          </Button>
        </div>
        {loading ? (
          <Spin spinning={loading} fullscreen />
        ) : (
          <Table columns={columns} dataSource={dataTelegramIntergration} />
        )}
      </div>
    </>
  );
};

export default TelegramIntegration;
