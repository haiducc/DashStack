"use client";

import Header from "@/app/component/Header";
import { Button, Form, Input, Space, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import BaseModal from "@/app/component/config/BaseModal";

interface DataPhoneNumber {
  key: string;
  phone_number: number;
  network_operator: string;
  note: string;
}

const initialData: DataPhoneNumber[] = [
  {
    key: "1",
    phone_number: 123,
    network_operator: "Viettel",
    note: "",
  },
];

const PhoneNumber: React.FC = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] =
    useState<DataPhoneNumber | null>(null);
  const [dataPhoneNumber, setDataPhoneNumber] =
    useState<DataPhoneNumber[]>(initialData);

  const handleAddConfirm = () => {
    const formData = form.getFieldsValue();
    if (currentPhoneNumber) {
      setDataPhoneNumber((prev) =>
        prev.map((phone) =>
          phone.key === currentPhoneNumber.key
            ? { ...currentPhoneNumber, ...formData }
            : phone
        )
      );
    } else {
      setDataPhoneNumber((prev) => [
        ...prev,
        { key: Date.now().toString(), ...formData },
      ]);
    }
    setAddModalOpen(false);
    form.resetFields();
    setCurrentPhoneNumber(null);
  };

  const handleEditPhoneNumber = (phone: DataPhoneNumber) => {
    setCurrentPhoneNumber(phone);
    form.setFieldsValue(phone);
    setAddModalOpen(true);
  };

  const handleDeletePhoneNumber = (phone: DataPhoneNumber) => {
    Modal.confirm({
      title: "Xóa số điện thoại",
      content: `Bạn có chắc chắn muốn xóa số điện thoại ${phone.phone_number}?`,
      onOk: () => {
        setDataPhoneNumber((prev) => prev.filter((a) => a.key !== phone.key));
      },
    });
  };

  const columns = [
    { title: "Số điện thoại", dataIndex: "phone_number", key: "phone_number" },
    {
      title: "Nhà mạng",
      dataIndex: "network_operator",
      key: "network_operator",
    },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    {
      title: "Chức năng",
      key: "action",
      render: (record: DataPhoneNumber) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditPhoneNumber(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeletePhoneNumber(record)}
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
          Danh sách số điện thoại
        </div>
        <div className="flex justify-between items-center mb-7">
          <Input
            placeholder="Tìm kiếm số điện thoại ..."
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
              setCurrentPhoneNumber(null);
              form.resetFields();
              setAddModalOpen(true);
            }}
          >
            Thêm mới
          </Button>
        </div>
        <Table columns={columns} dataSource={dataPhoneNumber} />
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        title={
          currentPhoneNumber
            ? "Chỉnh sửa số điện thoại"
            : "Thêm mới số điện thoại"
        }
      >
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col gap-4 w-full"
        >
          <Form.Item
            label="Số điện thoại"
            name="phone_number"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            label="Nhà mạng"
            name="network_operator"
            rules={[{ required: true, message: "Vui lòng nhập nhà mạng!" }]}
          >
            <Input placeholder="Nhập nhà mạng" />
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
              {currentPhoneNumber ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
    </>
  );
};

export default PhoneNumber;
