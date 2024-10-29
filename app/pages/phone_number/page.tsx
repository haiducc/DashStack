"use client";

import Header from "@/app/component/Header";
import { Button, Form, Input, Space, Table, Modal, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import BaseModal from "@/app/component/config/BaseModal";
import {
  addPhoneNumber,
  deletePhone,
  getListPhone,
} from "@/app/services/phone";
import {
  DataPhoneNumber,
  PhoneNumberModal,
} from "@/app/component/modal/modalPhoneNumber";

// export interface PhoneNumberModal {
//   key: string;
//   number?: string;
//   com?: string;
//   notes?: string;
//   id?: number;
// }

// export interface DataPhoneNumber {
//   key: string;
//   phone_number: string;
//   network_operator: string;
//   note?: string;
// }

const PhoneNumber: React.FC = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] =
    useState<PhoneNumberModal | null>(null);
  const [dataPhoneNumber, setDataPhoneNumber] = useState<DataPhoneNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [globalTerm, setGlobalTerm] = useState("");

  const fetchListPhone = async (globalTerm = "") => {
    try {
      const response = await getListPhone(1, 20, globalTerm);
      const formattedData =
        response?.data?.source?.map((x: PhoneNumberModal) => ({
          key: x.id?.toString() || Date.now().toString(),
          phone_number: x.number,
          network_operator: x.com,
          note: x.notes,
        })) || [];
      setDataPhoneNumber(formattedData);
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
    }
  };

  useEffect(() => {
    fetchListPhone(globalTerm);
  }, [globalTerm]);

  const handleAddConfirm = async () => {
    const formData = form.getFieldsValue();
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await addPhoneNumber({
        phone_number: formData.phone_number,
        network_operator: formData.network_operator,
        note: formData.note,
        key: formData.key,
      });
      setAddModalOpen(false);
      form.resetFields();
      setCurrentPhoneNumber(null);
      setLoading(false);
      await fetchListPhone();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleEditPhoneNumber = (phone: DataPhoneNumber) => {
    form.setFieldsValue({
      phone_number: phone.phone_number,
      network_operator: phone.network_operator,
      note: phone.note,
      key: phone.key,
    });
    setAddModalOpen(true);
  };

  const handleDeletePhoneNumber = (phone: DataPhoneNumber) => {
    Modal.confirm({
      title: "Xóa tài khoản ngân hàng",
      content: `Bạn có chắc chắn chấp nhận xóa số điện thoại ${phone.phone_number} này không?`,
      onOk: async () => {
        setLoading(true);
        try {
          await deletePhone(phone.key);
          await fetchListPhone();
        } catch (error) {
          console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    try {
      if (value.trim() === "") {
        const data = await getListPhone(1, 20);
        const formattedData =
          data?.data?.source?.map((x: DataPhoneNumber) => ({
            key: x.key,
            phone_number: x.phone_number || "",
            network_operator: x.network_operator,
            note: x.note,
          })) || [];

        setDataPhoneNumber(formattedData);
      } else {
        // Nếu có giá trị tìm kiếm, gọi API với giá trị đó
        const data = await getListPhone(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: DataPhoneNumber) => ({
            key: x.key,
            phone_number: x.phone_number,
            network_operator: x.network_operator,
            note: x.note,
          })) || [];

        setDataPhoneNumber(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản ngân hàng:", error);
    }
  };

  // fetch để gọi ra danh sách theo value search
  useEffect(() => {
    fetchListPhone();
  }, []);

  const columns = [
    { title: "id", dataIndex: "key", key: "key" },
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
            onChange={(e) => {
              const value = e.target.value;
              handleSearch(value);
            }}
            onPressEnter={async (e) => {
              handleSearch(e.currentTarget.value);
            }}
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
        {loading ? (
          <Spin spinning={loading} fullscreen />
        ) : (
          <Table columns={columns} dataSource={dataPhoneNumber} />
        )}
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
          <Form.Item hidden label="key" name="key">
            <Input hidden />
          </Form.Item>
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
