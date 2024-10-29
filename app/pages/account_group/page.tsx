"use client";

import Header from "@/app/component/Header";
import { Button, Form, Input, Space, Table, Modal, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import BaseModal from "@/app/component/config/BaseModal";
import { DataAccountGroup } from "@/app/component/modal/modalAccountGroup";
import {
  addAccountGroup,
  deleteAccountGroup,
  getAccountGroup,
} from "@/app/services/accountGroup";

const PhoneNumber: React.FC = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<DataAccountGroup | null>(
    null
  );
  const [dataAccountGroup, setDataAccountGroup] = useState<DataAccountGroup[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [globalTerm, setGlobalTerm] = useState("");

  const fetchAccountGroup = async (globalTerm = "") => {
    try {
      const response = await getAccountGroup(1, 20, globalTerm);
      const formattedData =
        response?.data?.source?.map((x: DataAccountGroup) => ({
          id: x.id?.toString() || Date.now().toString(),
          fullName: x.fullName,
          notes: x.notes,
        })) || [];
      setDataAccountGroup(formattedData);
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
    }
  };

  useEffect(() => {
    fetchAccountGroup(globalTerm);
  }, [globalTerm]);

  const handleAddConfirm = async () => {
    const formData = form.getFieldsValue();
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await addAccountGroup({
        id: formData.id,
        fullName: formData.fullName,
        notes: formData.notes,
      });
      setAddModalOpen(false);
      form.resetFields();
      setCurrentAccount(null);
      setLoading(false);
      await fetchAccountGroup();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleEditAccountGroup = (accountGroup: DataAccountGroup) => {
    form.setFieldsValue({
      id: accountGroup.id,
      fullName: accountGroup.fullName,
      notes: accountGroup.notes,
    });
    setAddModalOpen(true);
  };

  const handleDeleteAccountGroup = (x: DataAccountGroup) => {
    Modal.confirm({
      title: "Xóa tài khoản ngân hàng",
      content: `Bạn có chắc chắn chấp nhận xóa nhóm tài khoản ${x.fullName} này không?`,
      onOk: async () => {
        setLoading(true);
        try {
          await deleteAccountGroup(x.id);
          await fetchAccountGroup();
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
        const data = await getAccountGroup(1, 20);
        const formattedData =
          data?.data?.source?.map((x: DataAccountGroup) => ({
            id: x.id,
            fullName: x.fullName || "",
            notes: x.notes,
          })) || [];

        setDataAccountGroup(formattedData);
      } else {
        // Nếu có giá trị tìm kiếm, gọi API với giá trị đó
        const data = await getAccountGroup(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: DataAccountGroup) => ({
            id: x.id,
            fullName: x.fullName || "",
            notes: x.notes,
          })) || [];

          setDataAccountGroup(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản ngân hàng:", error);
    }
  };

  // fetch để gọi ra danh sách theo value search
  useEffect(() => {
    fetchAccountGroup();
  }, []);

  const columns = [
    { title: "id", dataIndex: "id", key: "id" },
    { title: "Tên nhóm tài khoản", dataIndex: "fullName", key: "fullName" },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
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
              setCurrentAccount(null);
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
          <Table columns={columns} dataSource={dataAccountGroup} />
        )}
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
          <Form.Item hidden label="id" name="id">
            <Input hidden />
          </Form.Item>
          <Form.Item
            label="Tên nhóm tài khoản"
            name="fullName"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhóm tài khoản!" },
            ]}
          >
            <Input placeholder="Nhập nhóm tài khoản" />
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
              {currentAccount ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
    </>
  );
};

export default PhoneNumber;
