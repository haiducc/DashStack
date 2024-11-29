"use client";

import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "@/src/component/Header";
import { Button, Form, Input, Modal, Skeleton, Space, Table } from "antd";
import BaseModal from "@/src/component/config/BaseModal";
import { toast } from "react-toastify"; // Import toast
import DeleteModal from "@/src/component/config/modalDelete";
import {
  addGroupSystem,
  deleteGroupSystem,
  getGroupSystem,
} from "@/src/services/groupSystem";
import { useRouter } from "next/navigation";

export interface DataSystemModal {
  id: number;
  name: string;
  note: string;
}

interface FilterRole {
  Name: string;
  Value: string;
}

type DataTypeWithKey = DataSystemModal & { key: React.Key };

const { confirm } = Modal;

const GroupSystemPage = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const [form] = Form.useForm();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentSystem, setCurrentSystem] = useState<DataSystemModal | null>(
    null
  );
  const [dataSystem, setDataSystem] = useState<DataSystemModal[]>([]);
  const [, setGlobalTerm] = useState("");
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  const [keys, setKeys] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<string | null>(null);
  const [isAddGroupSystem, setIsAddGroupSystem] = useState<boolean>(false);

  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchGroupSystem = async (globalTerm?: string) => {
    const arrRole: FilterRole[] = [];
    const addedParams = new Set<string>();
    arrRole.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    try {
      const response = await getGroupSystem(
        pageIndex,
        pageSize,
        globalTerm,
        arrRole
      );
      const formattedData =
        response?.data?.source?.map((x: DataSystemModal) => ({
          id: x.id,
          name: x.name,
          note: x.note,
        })) || [];
      setDataSystem(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupSystem();
  }, [keys]);

  const handleAddConfirm = async (isAddGroupSystem: boolean) => {
    try {
      await form.validateFields();
      setLoading(true);
      setIsAddGroupSystem(isAddGroupSystem);
      const formData = form.getFieldsValue();
      setIsAddModalOpen(false);
      const response = await addGroupSystem({
        id: formData.id,
        name: formData.name,
        note: formData.note,
      });
      if (response && response.success === false) {
        toast.error(response.message || "Có lỗi xảy ra, vui lòng thử lại!");
        setLoading(false);
        // setIsAddGroupSystem(false);
        return;
      }
      setIsAddModalOpen(false);
      form.resetFields();
      setCurrentSystem(null);
      toast.success(
        currentSystem ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      await fetchGroupSystem();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsAddGroupSystem(false);
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
    } finally {
      setIsAddGroupSystem(false);
    }
  };

  const handleEditTele = (x: DataSystemModal) => {
    setCurrentSystem(x);
    form.setFieldsValue({
      id: x.id,
      name: x.name,
      note: x.note,
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteTele = async (x: DataSystemModal) => {
    setLoading(true);
    try {
      setIsAddModalOpen(false);
      await deleteGroupSystem(x.id);
      toast.success("Xóa nhóm hệ thống thành công!");
      await fetchGroupSystem();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Có lỗi xảy ra khi xóa!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    try {
      if (value.trim() === "") {
        const data = await getGroupSystem(1, 20);
        const formattedData =
          data?.data?.source?.map((x: DataSystemModal) => ({
            id: x.id,
            name: x.name,
            note: x.note,
          })) || [];

        setDataSystem(formattedData);
      } else {
        const data = await getGroupSystem(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: DataSystemModal) => ({
            id: x.id,
            name: x.name,
            note: x.note,
          })) || [];

        setDataSystem(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản ngân hàng:", error);
      toast.error("Có lỗi xảy ra khi tìm kiếm!");
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<DataSystemModal | null>(null);

  const handleDeleteClick = (x: DataSystemModal) => {
    setSelectedAccountGroup(x);
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
    { title: "Tên hệ thống", dataIndex: "name", key: "name" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    {
      title: "Chức năng",
      key: "action",
      render: (record: DataSystemModal) => (
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const dataSource = dataSystem.map((item, index) => ({
    ...item,
    key: `unique-key-${item.id || index}`,
  }));

  const handleDeletes = async () => {
    setLoading(true);
    try {
      for (const key of selectedRowKeys) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const itemToDelete = dataSystem.find((item: any) => item.key === key);
        if (itemToDelete) {
          await deleteGroupSystem(itemToDelete.id);
        }
      }
      const newDataSource = dataSystem.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => !selectedRowKeys.includes(item.key)
      );
      setDataSystem(newDataSource);
      setSelectedRowKeys([]);
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Có lỗi xảy ra khi xóa!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = () => {
    if (selectedRowKeys.length === 0) {
      return;
    }
    confirm({
      title: "Bạn có chắc chắn muốn xóa các mục đã chọn?",
      onOk: async () => {
        await handleDeletes();
      },
      onCancel() {
        console.log("Đã hủy bỏ");
      },
    });
  };

  const [checkFilter, setCheckFilter] = useState(false);
  useEffect(() => {
    fetchGroupSystem();
  }, [checkFilter]);

  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">Danh sách hệ thống</div>
        <div className="flex justify-between items-center mb-7">
          <Input
            placeholder="Tìm kiếm hệ thống ..."
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
          <div>
            {selectedRowKeys.length > 0 && (
              <Button
                className="bg-[#4B5CB8] w-[136px] !h-10 text-white font-medium hover:bg-[#3A4A9D]"
                onClick={handleDeleteConfirmation}
              >
                Delete Selected
              </Button>
            )}
            <Button
              className="bg-[#4B5CB8] w-[136px] !h-10 text-white font-medium hover:bg-[#3A4A9D]"
              onClick={() => {
                setCurrentSystem(null);
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
                // key: `key${index}`,
                key: `loading-${index}`,
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rowKey="key"
            dataSource={dataSource}
            columns={columns}
            rowSelection={rowSelection}
          />
        )}
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        title={currentSystem ? "Chỉnh sửa hệ thống" : "Thêm mới hệ thống"}
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
            label="Tên hệ thống"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên hệ thống!" }]}
          >
            <Input placeholder="Tên nhóm hệ thống" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
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
              className="bg-[#4B5CB8] border text-white font-medium w-[189px] !h-10"
              loading={isAddGroupSystem}
            >
              {currentSystem ? "Cập nhật" : "Thêm mới"}
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

export default GroupSystemPage;
