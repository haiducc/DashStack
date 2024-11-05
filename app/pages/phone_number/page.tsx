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
import { PhoneNumberModal } from "@/app/component/modal/modalPhoneNumber";
import { toast } from "react-toastify"; // Import toast

const PhoneNumber: React.FC = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] =
    useState<PhoneNumberModal | null>(null);
  const [dataPhoneNumber, setDataPhoneNumber] = useState<PhoneNumberModal[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [globalTerm, setGlobalTerm] = useState("");

  const fetchListPhone = async (globalTerm = "") => {
    setLoading(true);
    try {
      const response = await getListPhone(1, 20, globalTerm);
      const formattedData =
        response?.data?.source?.map((x: PhoneNumberModal) => ({
          id: x.id,
          number: x.number,
          com: x.com,
          notes: x.notes,
        })) || [];
      setDataPhoneNumber(formattedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách số điện thoại:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListPhone(globalTerm);
  }, [globalTerm]);

  const handleAddConfirm = async () => {
    const formData = form.getFieldsValue();
    setLoading(true);
    try {
      await addPhoneNumber({
        number: formData.number,
        com: formData.com,
        notes: formData.notes,
        id: formData.id,
      });
      toast.success("Đã thêm số điện thoại thành công!"); // Sử dụng toast
      setAddModalOpen(false);
      form.resetFields();
      setCurrentPhoneNumber(null);
      await fetchListPhone();
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPhoneNumber = (phone: PhoneNumberModal) => {
    setCurrentPhoneNumber(phone);
    form.setFieldsValue({
      number: phone.number,
      com: phone.com,
      notes: phone.notes,
      id: phone.id,
    });
    setAddModalOpen(true);
  };

  const handleDeletePhoneNumber = (phone: PhoneNumberModal) => {
    Modal.confirm({
      title: "Xóa số điện thoại",
      content: `Bạn có chắc chắn muốn xóa số điện thoại ${phone.number}?`,
      onOk: async () => {
        setLoading(true);
        try {
          await deletePhone(phone.id);
          toast.success("Đã xóa số điện thoại thành công!");
          await fetchListPhone();
        } catch (error) {
          console.error("Lỗi khi xóa số điện thoại:", error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    try {
      setLoading(true);
      if (value.trim() === "") {
        const data = await getListPhone(1, 20);
        const formattedData =
          data?.data?.source?.map((x: PhoneNumberModal) => ({
            id: x.id,
            number: x.number || "",
            com: x.com,
            notes: x.notes,
          })) || [];

        setDataPhoneNumber(formattedData);
      } else {
        const data = await getListPhone(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: PhoneNumberModal) => ({
            id: x.id,
            number: x.number || "",
            com: x.com,
            notes: x.notes,
          })) || [];

        setDataPhoneNumber(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm số điện thoại:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListPhone();
  }, []);

  const columns = [
    { title: "id", dataIndex: "id", key: "id", hidden: true },
    { title: "Số điện thoại", dataIndex: "number", key: "number" },
    {
      title: "Nhà mạng",
      dataIndex: "com",
      key: "com",
    },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Hành động",
      key: "action",
      render: (record: PhoneNumberModal) => (
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
          <Form.Item hidden label="id" name="id">
            <Input hidden />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="number"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            label="Nhà mạng"
            name="com"
            rules={[{ required: true, message: "Vui lòng nhập nhà mạng!" }]}
          >
            <Input placeholder="Nhập nhà mạng" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="notes">
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
