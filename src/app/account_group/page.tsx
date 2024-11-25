"use client";

import Header from "@/src/component/Header";
import { Button, Form, Input, Space, Table, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import BaseModal from "@/src/component/config/BaseModal";
import { DataAccountGroup } from "@/src/component/modal/modalAccountGroup";
import {
  addAccountGroup,
  deleteAccountGroup,
  getAccountGroup,
} from "@/src/services/accountGroup";
import { toast } from "react-toastify";
import DeleteModal from "@/src/component/config/modalDelete";
import { useRouter } from "next/navigation";

interface filterGroupAccount {
  Name: string;
  Value: string;
}

const PhoneNumber: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<DataAccountGroup | null>(
    null
  );
  const [dataAccountGroup, setDataAccountGroup] = useState<DataAccountGroup[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [, setGlobalTerm] = useState("");
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  // const keys = localStorage.getItem("key");
  // const values = localStorage.getItem("value");
  const [keys, setKeys] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<string | null>(null);
  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchAccountGroup = async (globalTerm?: string) => {
    const arr: filterGroupAccount[] = [];
    const addedParams = new Set<string>();
    arr.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    setLoading(true);
    try {
      const response = await getAccountGroup(
        pageIndex,
        pageSize,
        globalTerm,
        arr
      );
      const formattedData =
        response?.data?.source?.map((x: DataAccountGroup) => ({
          id: x.id?.toString() || Date.now().toString(),
          fullName: x.fullName,
          notes: x.notes,
        })) || [];
      setDataAccountGroup(formattedData);
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountGroup();
  }, [keys]);

  const handleAddConfirm = async () => {
    try {
      await form.validateFields(); // Xác nhận form hợp lệ trước
      const formData = form.getFieldsValue();
      setAddModalOpen(false); // Đóng popup ngay lập tức
      setLoading(true);

      // Xử lý thêm mới
      await addAccountGroup({
        id: formData.id,
        fullName: formData.fullName,
        notes: formData.notes,
      });

      toast.success(
        currentAccount ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      await fetchAccountGroup();
      form.resetFields();
      setCurrentAccount(null);
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccountGroup = (accountGroup: DataAccountGroup) => {
    form.setFieldsValue({
      id: accountGroup.id,
      fullName: accountGroup.fullName,
      notes: accountGroup.notes,
    });
    setCurrentAccount(accountGroup);
    setAddModalOpen(true);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<DataAccountGroup | null>(null);

  const handleDeleteAccountGroup = async (x: DataAccountGroup) => {
    setLoading(true);
    try {
      setAddModalOpen(false);
      const response = await deleteAccountGroup(x.id);
      if (response.success === false) {
        toast.error(response.message || "Đã có lỗi xảy ra. Vui lòng thử lại!");
        return;
      }
      toast.success("Xóa thành công!");
      await fetchAccountGroup();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Lỗi khi xóa nhóm tài khoản:", error);
      if (error.isAxiosError && error.response) {
        const { status, data } = error.response;
        if (status === 400 && data && data.message) {
          toast.error(data.message || "Đã có lỗi xảy ra. Vui lòng thử lại!");
        } else {
          toast.error(data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!");
        }
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (accountGroup: DataAccountGroup) => {
    setSelectedAccountGroup(accountGroup);
    setIsDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedAccountGroup(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAccountGroup) {
      handleDeleteAccountGroup(selectedAccountGroup);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    await fetchAccountGroup(value);
  };

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
            onClick={() => handleDeleteClick(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const [checkFilter, setCheckFilter] = useState(false);
  useEffect(() => {
    fetchAccountGroup();
  }, [checkFilter]);

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
              setGlobalTerm(value);
              if (!value) {
                setCheckFilter(!checkFilter);
              }
            }}
            onPressEnter={(e) => handleSearch(e.currentTarget.value)}
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
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={dataAccountGroup}
            rowKey={"id"}
          />
        </Spin>
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
        maskClosable={false}
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
              loading={loading}
            >
              {currentAccount ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
      <DeleteModal
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        selectedAccountGroup={selectedAccountGroup}
      />
    </>
  );
};

export default PhoneNumber;