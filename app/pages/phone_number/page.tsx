"use client";

import Header from "@/app/component/Header";
import { Button, Form, Input, Space, Table, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import BaseModal from "@/app/component/config/BaseModal";
import {
  addPhoneNumber,
  deletePhone,
  getListPhone,
} from "@/app/services/phone";
import { PhoneNumberModal } from "@/app/component/modal/modalPhoneNumber";
import { toast } from "react-toastify";
import DeleteModal from "@/app/component/config/modalDelete";

interface filterRole {
  Name: string;
  Value: string;
}

const PhoneNumber: React.FC = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] =
    useState<PhoneNumberModal | null>(null);
  const [dataPhoneNumber, setDataPhoneNumber] = useState<PhoneNumberModal[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [globalTerm, setGlobalTerm] = useState("");
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  // const keys = localStorage.getItem("key");
  // const values = localStorage.getItem("value");
  const [keys, setKeys] = useState<string | null>(null);
  const [values, setValues] = useState<string | null>(null);
  useEffect(() => {
      setKeys(localStorage.getItem("key"));
      setValues(localStorage.getItem("value"));
  }, []);

  const fetchListPhone = async (globalTerm?: string) => {
    const arrRole: filterRole[] = [];
    const obj: filterRole = {
      Name: keys!,
      Value: values!,
    };
    arrRole.push(obj);
    setLoading(true);
    try {
      const response = await getListPhone(
        pageIndex,
        pageSize,
        globalTerm,
        arrRole
      );
      const formattedData =
        response?.data?.source?.map((x: PhoneNumberModal) => ({
          id: x.id,
          number: x.number,
          com: x.com,
          notes: x.notes,
        })) || [];
      setDataPhoneNumber(formattedData);
    } catch (error) {
      console.error("Error while loading phone list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListPhone();
  }, [keys]);

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
      toast.success("Phone number added successfully!");
      setAddModalOpen(false);
      form.resetFields();
      setCurrentPhoneNumber(null);
      await fetchListPhone();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        console.error("Error:", error);
        toast.error("An unexpected error occurred.");
      }
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

  const handleDeletePhoneNumber = async (phone: PhoneNumberModal) => {
    setLoading(true);
    try {
      await deletePhone(phone.id);
      toast.success("Phone number deleted successfully!");
      await fetchListPhone();
    } catch (error) {
      console.error("Error deleting phone number:", error);
    } finally {
      setLoading(false);
    }
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
      console.error("Error while searching for phone number:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "id", dataIndex: "id", key: "id", hidden: true },
    { title: "Số điện thoại", dataIndex: "number", key: "number" },
    { title: "Nhà cung cấp mạng", dataIndex: "com", key: "com" },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Actions",
      key: "action",
      render: (record: PhoneNumberModal) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditPhoneNumber(record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteClick(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<PhoneNumberModal | null>(null);

  const handleDeleteClick = (accountGroup: PhoneNumberModal) => {
    setSelectedAccountGroup(accountGroup);
    setIsDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedAccountGroup(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAccountGroup) {
      handleDeletePhoneNumber(selectedAccountGroup);
      setIsDeleteModalOpen(false);
    }
  };

  const [checkFilter, setCheckFilter] = useState(false);
  useEffect(() => {
    fetchListPhone();
  }, [checkFilter]);

  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">
          Danh sách số điện thoại
        </div>
        <div className="flex justify-between items-center mb-7">
          <Input
            placeholder="Search phone number ..."
            style={{
              width: 253,
              borderRadius: 10,
              height: 38,
              marginRight: 15,
            }}
            onChange={(e) => {
              const value = e.target.value;
              setGlobalTerm(value);
              if (!value) {
                setCheckFilter(!checkFilter);
              }
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
            Thêm mưới
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
            label="Phone Number"
            name="number"
            rules={[
              { required: true, message: "Please enter a phone number!" },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            label="Network Provider"
            name="com"
            rules={[
              { required: true, message: "Please enter a network provider!" },
            ]}
          >
            <Input placeholder="Enter network provider" />
          </Form.Item>
          <Form.Item label="Notes" name="notes">
            <Input.TextArea rows={4} placeholder="Enter notes" />
          </Form.Item>
          <div className="flex justify-end">
            <Button
              onClick={() => setAddModalOpen(false)}
              className="w-[189px] h-[42px]"
            >
              Close
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

      <DeleteModal
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        handleDeletePhoneNumber={selectedAccountGroup}
      />
    </>
  );
};

export default PhoneNumber;
