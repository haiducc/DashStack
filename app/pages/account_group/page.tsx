"use client";

import Header from "@/app/component/Header";
import { Button, Form, Input, Space, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import BaseModal from "@/app/component/config/BaseModal";

interface DataAccountGroup {
  key: string;
  name_group: string;
  note: string;
}

const initialData: DataAccountGroup[] = [
  {
    key: "1",
    name_group: "Nhóm IT",
    note: "",
  },
];

const PhoneNumber: React.FC = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<DataAccountGroup | null>(null);
  const [dataAccountGroup, setDataAccountGroup] = useState<DataAccountGroup[]>(initialData);

  const handleAddConfirm = () => {
    const formData = form.getFieldsValue();
    if (currentAccount) {
      setDataAccountGroup((prev) =>
        prev.map((x) =>
          x.key === currentAccount.key
            ? { ...currentAccount, ...formData }
            : x
        )
      );
    } else {
      setDataAccountGroup((prev) => [
        ...prev,
        { key: Date.now().toString(), ...formData },
      ]);
    }
    setAddModalOpen(false);
    form.resetFields();
    setCurrentAccount(null);
  };

  const handleEditAccountGroup = (x: DataAccountGroup) => {
    setCurrentAccount(x);
    form.setFieldsValue(x);
    setAddModalOpen(true);
  };

  const handleDeleteAccountGroup = (x: DataAccountGroup) => {
    Modal.confirm({
      title: "Xóa nhóm tài khoản",
      content: `Bạn có chắc chắn muốn xóa nhóm tài khoản ${x.name_group}?`,
      onOk: () => {
        setDataAccountGroup((prev) => prev.filter((a) => a.key !== a.key));
      },
    });
  };

  const columns = [
    { title: "Tên nhóm tài khoản", dataIndex: "name_group", key: "name_group" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    {
      title: "Chức năng",
      key: "action",
      render: (record: DataAccountGroup) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditAccountGroup(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteAccountGroup(record)}
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
          Danh sách nhóm tài khoản
        </div>
        <div className="flex justify-between items-center mb-7">
          <Input
            placeholder="Tìm kiếm tên nhóm tài khoản ..."
            style={{
              width: 253,
              borderRadius: 10,
              height: 38,
              marginRight: 15,
            }}
            onPressEnter={(e) =>
              console.log("Search value:", e.currentTarget.value)
            }
          />
          <Button
            className="bg-[#4B5CB8] w-[136px] h-[40px] text-white font-medium hover:bg-[#3A4A9D]"
            onClick={() => {
              setCurrentAccount(null);
              form.resetFields();
              setAddModalOpen(true);
            }}
          >
            Thêm mới
          </Button>
        </div>
        <Table columns={columns} dataSource={dataAccountGroup} />
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        title={
          currentAccount
            ? "Chỉnh sửa nhóm tài khoản"
            : "Thêm mới nhóm tài khoản"
        }
      >
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col gap-1 w-full"
        >
          <Form.Item
            label="Tên nhóm tài khoản"
            name="name_group"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhóm tài khoản!" },
            ]}
          >
            <Input placeholder="Nhập nhóm tài khoản" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
          </Form.Item>
          <div className="flex justify-end">
            <Button
              onClick={() => setAddModalOpen(false)}
              className="w-[189px] h-[42px]"
            >
              Đóng
            </Button>
            <div className="w-5" />
            <Button
              type="primary"
              onClick={handleAddConfirm}
              className="bg-[#4B5CB8] border text-white font-medium w-[189px] h-[42px]"
            >
              {currentAccount ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
    </>
  );
};

export default PhoneNumber;
