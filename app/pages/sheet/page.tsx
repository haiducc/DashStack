"use client";

import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BaseModal from "@/app/component/config/BaseModal";
import Header from "@/app/component/Header";
import { Button, Form, Input, Space, Spin, Table } from "antd";
import { addSheet, deleteSheet, getListSheet } from "@/app/services/sheet";
import { toast } from "react-toastify";
import DeleteModal from "@/app/component/config/modalDelete";
import { useRouter } from "next/navigation";

export interface dataSheetModal {
  id?: number;
  name: string;
  linkUrl: string;
  notes: string;
}

interface filterRole {
  Name: string;
  Value: string;
}

const Sheet = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/pages/login");
    }
  }, []);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentSheet, setCurrentSheet] = useState<dataSheetModal | null>(null);
  const [dataSheet, setDataSheet] = useState<dataSheetModal[]>([]);
  const [globalTerm, setGlobalTerm] = useState("");
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  const [keys, setKeys] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<string | null>(null);
  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchSheet = async (globalTerm?: string) => {
    const arr: filterRole[] = [];
    const addedParams = new Set<string>();
    arr.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    try {
      const response = await getListSheet(
        pageIndex,
        pageSize,
        globalTerm,
        arr
      );
      const formattedData =
        response?.data?.source?.map((x: dataSheetModal) => ({
          id: x.id?.toString() || Date.now().toString(),
          name: x.name,
          linkUrl: x.linkUrl,
          notes: x.notes,
        })) || [];
      setDataSheet(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchSheet(globalTerm);
  }, [globalTerm]);

  const handleAddConfirm = async () => {
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();
      setLoading(true);
      if (currentSheet) {
        await addSheet({
          id: currentSheet.id,
          name: formData.name,
          linkUrl: formData.linkUrl,
          notes: formData.notes,
        });
        toast.success("Cập nhật thành công!");
      } else {
        await addSheet({
          // id: Date.now(),
          name: formData.name,
          linkUrl: formData.linkUrl,
          notes: formData.notes,
        });
        toast.success("Thêm mới thành công!");
      }

      setAddModalOpen(false);
      form.resetFields();
      setCurrentSheet(null);
      setLoading(false);
      await fetchSheet();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      setLoading(false);
    }
  };

  const handleEditSheet = (x: dataSheetModal) => {
    setCurrentSheet(x);
    form.setFieldsValue({
      id: x.id,
      name: x.name,
      linkUrl: x.linkUrl,
      notes: x.notes,
    });
    setAddModalOpen(true);
  };

  const handleDeleteSheet = async (x: dataSheetModal) => {
    if (!x.id) {
      toast.error("ID không hợp lệ!");
      return;
    }
    setLoading(true);
    try {
      await deleteSheet(x.id);
      await fetchSheet();
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
      toast.error("Có lỗi khi xóa, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<dataSheetModal | null>(null);

  const handleDeleteClick = (tele: dataSheetModal) => {
    setSelectedAccountGroup(tele);
    setIsDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedAccountGroup(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAccountGroup) {
      handleDeleteSheet(selectedAccountGroup);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    try {
      if (value.trim() === "") {
        const data = await getListSheet(1, 20);
        const formattedData =
          data?.data?.source?.map((x: dataSheetModal) => ({
            id: x.id,
            name: x.name,
            linkUrl: x.linkUrl,
            notes: x.notes,
          })) || [];

        setDataSheet(formattedData);
      } else {
        // Nếu có giá trị tìm kiếm, gọi API với giá trị đó
        const data = await getListSheet(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: dataSheetModal) => ({
            id: x.id,
            name: x.name,
            linkUrl: x.linkUrl,
            notes: x.notes,
          })) || [];

        setDataSheet(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản ngân hàng:", error);
    }
  };

  const columns = [
    { title: "id", dataIndex: "id", key: "id", hidden: true },
    { title: "Tên nhóm trang tính", dataIndex: "name", key: "name" },
    { title: "Id trang tính", dataIndex: "linkUrl", key: "linkUrl" },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Chức năng",
      key: "action",
      render: (record: dataSheetModal) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditSheet(record)}
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

  useEffect(() => {
    fetchSheet();
  }, [keys]);

  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">Danh sách trang tính</div>
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
              setCurrentSheet(null);
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
          <Table columns={columns} dataSource={dataSheet} />
        )}
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        title={
          currentSheet ? "Chỉnh sửa nhóm tài khoản" : "Thêm mới nhóm tài khoản"
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
            label="Tên nhóm trang tính"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhóm trang tính!" },
            ]}
          >
            <Input placeholder="Tên nhóm trang tính" />
          </Form.Item>
          <Form.Item
            label="ID trang tính"
            name="linkUrl"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên ID trang tính!",
              },
            ]}
          >
            <Input placeholder="Nhập ID trang tính" />
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
              {currentSheet ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
      <DeleteModal
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        handleDeleteSheet={selectedAccountGroup}
      />
    </>
  );
};

export default Sheet;
