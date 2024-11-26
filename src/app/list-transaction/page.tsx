"use client";

import Header from "@/src/component/Header";
import { Button, Form, Input, Select, Space, Table } from "antd";
import { useEffect, useState, startTransition } from "react";

import ModalAddNew from "@/src/module/listTransaction/modalAddNew";
import { apiClient } from "@/src/services/base_api";
import { DeatailIcon } from "@/public/icon/detail";
import { getBank } from "@/src/services/bankAccount";

const ListTransactionPage = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dataTransaction, setDataTransaction] = useState([]);
  const [banks, setBanks] = useState([]);

  const fetchBankData = async () => {
    try {
      const bankData = await getBank(1, 20);
      const formattedBanks =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bankData?.data?.source?.map((bank: any) => ({
          value: bank.id,
          label: bank.fullName || bank.code || "Không xác định",
        })) || [];
      setBanks(formattedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const columns = [
    { title: "id", dataIndex: "id", key: "id", hidden: true },
    { title: "Tài khoản", dataIndex: "bank", key: "bank" },
    {
      title: "Số tài khoản",
      dataIndex: "bankAccountId",
      key: "bankAccountId",
    },
    {
      title: "Người rút",
      dataIndex: "addedBy",
      key: "addedBy",
    },
    { title: "Người quản lý", dataIndex: "managerBy", key: "managerBy" },
    {
      title: "Ngày giao dịch",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Giao dịch",
      dataIndex: "transType",
      key: "transType",
    },
    {
      title: "Loại tiền",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Bộ phận quản lý",
      dataIndex: "departmentManager",
      key: "departmentManager",
    },
    {
      title: "Chi tiết",
      key: "action",
      render: () => <DeatailIcon />,
    },
  ];

  const fetchData = async () => {
    try {
      const responsive = await apiClient.get(
        "/asset-api/find?searchTerms[0].Name=isAdmin&searchTerms[0].Value=1&pageIndex=1&pageSize=20"
      );
      setDataTransaction(responsive.data.data.source);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = () => {
    setIsAddModalOpen((prev) => !prev);
  };

  const handleCreateAdd = () => {
    form.resetFields();
    setIsAddModalOpen(true);
    startTransition(() => {
      fetchBankData();
    });
  };

  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">Danh sách giao dịch</div>
        <div className="flex justify-between items-center mb-7">
          <div className="flex items-center">
            <Input
              placeholder="Số tài khoản, tên tài khoản ..."
              style={{
                width: 253,
                borderRadius: 10,
                height: 38,
                marginRight: 15,
              }}
            />
            <Space direction="horizontal" size="middle">
              <Select
                placeholder="Nhóm tài khoản"
                style={{ width: 245 }}
                allowClear
              />
            </Space>
            <div className="w-2" />
            <Space direction="horizontal" size="middle">
              <Select
                placeholder="Hệ thống"
                style={{ width: 245 }}
                allowClear
              />
            </Space>
            <div className="w-2" />
            <Space direction="horizontal" size="middle">
              <Select
                placeholder="Chi nhánh"
                style={{ width: 245 }}
                allowClear
              />
            </Space>
            <div className="w-2" />
            <Space direction="horizontal" size="middle">
              <Select
                placeholder="Đội nhóm"
                style={{ width: 245 }}
                allowClear
              />
            </Space>
          </div>
          <Button
            className="bg-[#4B5CB8] w-[136px] !h-10 text-white font-medium hover:bg-[#3A4A9D]"
            onClick={() => {
              handleCreateAdd();
            }}
          >
            Thêm mới
          </Button>
        </div>
        <Table columns={columns} dataSource={dataTransaction} />
      </div>

      <ModalAddNew
        isAddModalOpen={isAddModalOpen}
        onCancel={handleCancel}
        fetchData={fetchData}
        banks={banks}
      />
    </>
  );
};

export default ListTransactionPage;
