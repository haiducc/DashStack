"use client";

import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "@/src/component/Header";
import { Button, Form, Input, Space, Spin, Table } from "antd";
import {
  addTelegram,
  deleteTelegram,
  getListTelegram,
} from "@/src/services/telegram";
import BaseModal from "@/src/component/config/BaseModal";
import { toast } from "react-toastify"; // Import toast
import DeleteModal from "@/src/component/config/modalDelete";
import { useRouter } from "next/navigation";

export interface dataTelegramModal {
  id: number;
  name: string;
  chatId: string;
  notes: string;
}

interface filterRole {
  Name: string;
  Value: string;
}

const Telegram = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTelegram, setCurrentTelegram] =
    useState<dataTelegramModal | null>(null);
  const [dataTelegram, setDataTelegram] = useState<dataTelegramModal[]>([]);
  const [, setGlobalTerm] = useState("");
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  const [keys, setKeys] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<string | null>(null);
  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchTelegram = async (globalTerm?: string) => {
    const arr: filterRole[] = [];
    const addedParams = new Set<string>();
    arr.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    try {
      const response = await getListTelegram(
        pageIndex,
        pageSize,
        globalTerm,
        arr
      );
      const formattedData =
        response?.data?.source?.map((x: dataTelegramModal) => ({
          id: x.id?.toString() || Date.now().toString(),
          name: x.name,
          chatId: x.chatId,
          notes: x.notes,
        })) || [];
      setDataTelegram(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchTelegram();
  }, [keys]);

  const handleAddConfirm = async () => {
    try {
      await form.validateFields();
      setAddModalOpen(false);
      const formData = form.getFieldsValue();
      setLoading(true);
      const response = await addTelegram({
        id: formData.id,
        name: formData.name,
        chatId: formData.chatId,
        notes: formData.notes,
      });
      if (response && response.success === false) {
        toast.error(response.message || "Có lỗi xảy ra, vui lòng thử lại!");
        setLoading(false);
        return;
      }
      setAddModalOpen(false);
      form.resetFields();
      setCurrentTelegram(null);
      toast.success(
        currentTelegram ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      await fetchTelegram();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Lỗi:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const responseError = error as {
          response: { data?: { message?: string } };
        };

        if (responseError.response && responseError.response.data) {
          const { message } = responseError.response.data;
          toast.error(message || "Có lỗi xảy ra, vui lòng thử lại!");
        } else {
          toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  const handleEditTele = (x: dataTelegramModal) => {
    setCurrentTelegram(x);
    form.setFieldsValue({
      id: x.id,
      name: x.name,
      chatId: x.chatId,
      notes: x.notes,
    });
    setAddModalOpen(true);
  };

  const handleDeleteTele = async (x: dataTelegramModal) => {
    setLoading(true);
    try {
      setAddModalOpen(false);
      await deleteTelegram(x.id);
      toast.success("Xóa nhóm telegram thành công!");
      await fetchTelegram();
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
      toast.error("Có lỗi xảy ra khi xóa!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    try {
      if (value.trim() === "") {
        const data = await getListTelegram(1, 20);
        const formattedData =
          data?.data?.source?.map((x: dataTelegramModal) => ({
            id: x.id,
            name: x.name,
            chatId: x.chatId,
            notes: x.notes,
          })) || [];

        setDataTelegram(formattedData);
      } else {
        const data = await getListTelegram(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: dataTelegramModal) => ({
            id: x.id,
            name: x.name,
            chatId: x.chatId,
            notes: x.notes,
          })) || [];

        setDataTelegram(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản ngân hàng:", error);
      toast.error("Có lỗi xảy ra khi tìm kiếm!");
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<dataTelegramModal | null>(null);

  const handleDeleteClick = (tele: dataTelegramModal) => {
    setSelectedAccountGroup(tele);
    setIsDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedAccountGroup(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAccountGroup) {
      handleDeleteTele(selectedAccountGroup);
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    { title: "id", dataIndex: "id", key: "id", hidden: true },
    { title: "Tên nhóm telegram", dataIndex: "name", key: "name" },
    { title: "Id nhóm telegram", dataIndex: "chatId", key: "chatId" },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Chức năng",
      key: "action",
      render: (record: dataTelegramModal) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditTele(record)}
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
    fetchTelegram();
  }, [checkFilter]);

  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">
          Danh sách nhóm telegram
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
            onPressEnter={async (e) => {
              handleSearch(e.currentTarget.value);
            }}
          />
          <Button
            className="bg-[#4B5CB8] w-[136px] h-[40px] text-white font-medium hover:bg-[#3A4A9D]"
            onClick={() => {
              setCurrentTelegram(null);
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
          <Table columns={columns} dataSource={dataTelegram} />
        )}
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        title={
          currentTelegram
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
            label="Tên nhóm telegram"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhóm telegram!" },
            ]}
          >
            <Input placeholder="Tên nhóm telegram" />
          </Form.Item>
          <Form.Item
            label="ID nhóm telegram"
            name="chatId"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên ID nhóm telegram!",
              },
            ]}
          >
            <Input placeholder="Nhập ID nhóm telegram" />
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
              {currentTelegram ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
      <DeleteModal
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        handleDeleteTele={selectedAccountGroup}
      />
    </>
  );
};

export default Telegram;
