"use client";

import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BaseModal from "@/src/component/config/BaseModal";
import Header from "@/src/component/Header";
import { Button, Form, Input, Skeleton, Space, Table } from "antd";
import { addSheet, deleteSheet, getListSheet } from "@/src/services/sheet";
import { toast } from "react-toastify";
import DeleteModal from "@/src/component/config/modalDelete";
import { useRouter } from "next/navigation";

export interface DataSheetModal {
  id?: number;
  name: string;
  linkUrl: string;
  notes: string;
}

interface FilterRole {
  Name: string;
  Value: string;
}

type DataTypeWithKey = DataSheetModal & { key: React.Key };

const Sheet = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentSheet, setCurrentSheet] = useState<DataSheetModal | null>(null);
  const [dataSheet, setDataSheet] = useState<DataSheetModal[]>([]);
  const [globalTerm, setGlobalTerm] = useState("");
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  const [keys, setKeys] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<string | null>(null);
  const [isAddSheet, setIsAddSheet] = useState<boolean>(false);

  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchSheet = async (globalTerm?: string) => {
    const arr: FilterRole[] = [];
    const addedParams = new Set<string>();
    arr.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    try {
      const response = await getListSheet(pageIndex, pageSize, globalTerm, arr);
      const formattedData =
        response?.data?.source?.map((x: DataSheetModal) => ({
          id: x.id?.toString() || Date.now().toString(),
          name: x.name,
          linkUrl: x.linkUrl,
          notes: x.notes,
        })) || [];
      setDataSheet(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheet(globalTerm);
  }, [globalTerm]);

  const handleAddConfirm = async (isAddSheet: boolean) => {
    try {
      await form.validateFields();
      setIsAddSheet(isAddSheet);
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
        setIsAddModalOpen(false);
      } else {
        await addSheet({
          // id: Date.now(),
          name: formData.name,
          linkUrl: formData.linkUrl,
          notes: formData.notes,
        });
        toast.success("Thêm mới thành công!");
        setIsAddModalOpen(false);
      }
      form.resetFields();
      setCurrentSheet(null);
      await fetchSheet();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
      setIsAddSheet(false);
    }
  };

  const handleEditSheet = (x: DataSheetModal) => {
    setCurrentSheet(x);
    form.setFieldsValue({
      id: x.id,
      name: x.name,
      linkUrl: x.linkUrl,
      notes: x.notes,
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteSheet = async (x: DataSheetModal) => {
    if (!x.id) {
      toast.error("ID không hợp lệ!");
      return;
    }
    setLoading(true);
    try {
      setIsAddModalOpen(false);
      await deleteSheet([x.id]);
      await fetchSheet();
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Có lỗi khi xóa, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<DataSheetModal | null>(null);

  const handleDeleteClick = (tele: DataSheetModal) => {
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
          data?.data?.source?.map((x: DataSheetModal) => ({
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
          data?.data?.source?.map((x: DataSheetModal) => ({
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
      render: (record: DataSheetModal) => (
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const dataSource = dataSheet.map((item) => ({
    ...item,
    key: item.id,
  }));

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDeletes = async () => {
    setLoading(true);
    try {
      const idsToDelete = selectedRowKeys.map((key) => Number(key));
      await deleteSheet(idsToDelete);
      toast.success("Xóa các mục thành công!");
      await fetchSheet();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Có lỗi xảy ra khi xóa!");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeletes = () => {
    handleDeletes();
    setIsModalVisible(false);
  };

  const handleDeleteConfirmation = () => {
    setIsModalVisible(true);
  };

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
          <div className="flex">
            {selectedRowKeys.length > 0 && (
              <Button
                className="bg-[#4B5CB8] w-[136px] !h-10 text-white font-medium hover:bg-[#3A4A9D]"
                onClick={handleDeleteConfirmation}
              >
                Xóa nhiều
              </Button>
            )}
            <div className="w-2" />
            <Button
              className="bg-[#4B5CB8] w-[136px] !h-10 text-white font-medium hover:bg-[#3A4A9D]"
              onClick={() => {
                setCurrentSheet(null);
                form.resetFields();
                setIsAddModalOpen(true);
              }}
            >
              Thêm mới
            </Button>
          </div>
        </div>
        {loading ? (
          <Table
            rowKey="key"
            pagination={false}
            loading={loading}
            dataSource={
              [...Array(13)].map((_, index) => ({
                key: `key${index}`,
              })) as DataTypeWithKey[]
            }
            columns={columns.map((column) => ({
              ...column,
              render: function renderPlaceholder() {
                return (
                  <Skeleton
                    key={column.key as React.Key}
                    title
                    active={false}
                    paragraph={false}
                  />
                );
              },
            }))}
          />
        ) : (
          <Table
            rowKey="key"
            dataSource={dataSource}
            columns={columns}
            rowSelection={rowSelection}
            loading={loading}
          />
        )}
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
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
              onClick={() => setIsAddModalOpen(false)}
              className="w-[189px] !h-10"
            >
              Đóng
            </Button>
            <div className="w-5" />
            <Button
              type="primary"
              onClick={() => handleAddConfirm(true)}
              className={`${
                isAddSheet && "pointer-events-none"
              } bg-[#4B5CB8] border text-white font-medium w-[189px] !h-10"`}
              loading={isAddSheet}
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
      <DeleteModal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleConfirmDeletes}
        handleDeleteTele={async () => {
          await handleDeletes();
          setIsModalVisible(false);
        }}
      />
    </>
  );
};

export default Sheet;
