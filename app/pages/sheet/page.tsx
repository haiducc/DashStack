"use client";

import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BaseModal from "@/app/component/config/BaseModal";
import Header from "@/app/component/Header";
import { Button, Form, Input, Modal, Space, Spin, Table } from "antd";
import { addSheet, deleteSheet, getListSheet } from "@/app/services/sheet";
import { toast } from "react-toastify";

export interface dataSheetModal {
  id: number;
  name: string;
  linkUrl: string;
  notes: string;
}

const Sheet = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentSheet, setCurrentSheet] = useState<dataSheetModal | null>(null);
  const [dataSheet, setDataSheet] = useState<dataSheetModal[]>([]);
  const [globalTerm, setGlobalTerm] = useState("");

  const fetchSheet = async (globalTerm = "") => {
    try {
      const response = await getListSheet(1, 20, globalTerm);
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
    const formData = form.getFieldsValue();
    setLoading(true);

    try {
      if (currentSheet) {
        await addSheet({
          id: currentSheet.id,
          name: formData.name,
          linkUrl: formData.linkUrl,
          notes: formData.notes,
        });
        toast.success("Cập nhật thành công!"); // Thông báo thành công
      } else {
        await addSheet({
          id: Date.now(), // Hoặc sử dụng logic id của bạn
          name: formData.name,
          linkUrl: formData.linkUrl,
          notes: formData.notes,
        });
        toast.success("Thêm mới thành công!"); // Thông báo thêm mới thành công
      }

      setAddModalOpen(false);
      form.resetFields();
      setCurrentSheet(null);
      setLoading(false);
      await fetchSheet();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!"); // Thông báo lỗi
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

  const handleDeleteSheet = (x: dataSheetModal) => {
    Modal.confirm({
      title: "Xóa nhóm telegram",
      content: `Bạn có chắc chắn chấp nhận xóa nhóm telegram ${x.name} này không?`,
      onOk: async () => {
        setLoading(true);
        try {
          await deleteSheet(x.id);
          await fetchSheet();
          toast.success("Xóa thành công!"); // Thông báo xóa thành công
        } catch (error) {
          console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
          toast.error("Có lỗi khi xóa, vui lòng thử lại!"); // Thông báo lỗi khi xóa
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
            onClick={() => handleDeleteSheet(record)}
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
              {currentSheet ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
    </>
  );
};

export default Sheet;
