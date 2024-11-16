"use client";

import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "@/app/component/Header";
import { Button, Form, Input, Select, Space, Spin, Table } from "antd";
import BaseModal from "@/app/component/config/BaseModal";
import { toast } from "react-toastify"; // Import toast
import DeleteModal from "@/app/component/config/modalDelete";
import {
  addGroupBranch,
  deleteGroupBranch,
  getBranchSystem,
} from "@/app/services/branchSystem";
import { getGroupSystem } from "@/app/services/groupSystem";

export interface dataBranchModal {
  id: number;
  name: string;
  note: string;
  groupSystemId: number;
  groupSystemName: string;
}

interface filterRole {
  Name: string;
  Value: string;
}

const GroupBranchPage = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<dataBranchModal | null>(
    null
  );
  const [dataBranch, setDataBranch] = useState<dataBranchModal[]>([]);
  const [, setGlobalTerm] = useState("");
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  const [keys, setKeys] = useState<string | null>(null);
  const [values, setValues] = useState<string | null>(null);
  const [groupSystem, setGroupSystem] = useState([]);
  const [systemId, setSystemId] = useState<number>(0);

  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchGroupSystem = async (globalTerm?: string) => {
    const arrRole: filterRole[] = [];
    const obj: filterRole = {
      Name: keys!,
      Value: values!,
    };
    arrRole.push(obj);
    try {
      const response = await getBranchSystem(
        pageIndex,
        pageSize,
        globalTerm,
        arrRole
      );
      const formattedData =
        response?.data?.source?.map((x: dataBranchModal) => ({
          id: x.id,
          name: x.name,
          note: x.note,
          groupSystemId: x.groupSystemId,
          groupSystemName: x.groupSystemName,
        })) || [];
      setDataBranch(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchGroupSystem();
  }, [keys]);

  const handleAddConfirm = async () => {
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();
      setLoading(true);
      const response = await addGroupBranch({
        id: formData.id,
        name: formData.name,
        note: formData.note,
        groupSystemId: formData.groupSystemId,
        groupSystemName: formData.groupSystemName,
      });
      if (response && response.success === false) {
        toast.error(response.message || "Có lỗi xảy ra, vui lòng thử lại!");
        setLoading(false);
        return;
      }
      setAddModalOpen(false);
      form.resetFields();
      setCurrentBranch(null);
      toast.success(
        currentBranch ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      await fetchGroupSystem();
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

  const handleEditTele = (x: dataBranchModal) => {
    setCurrentBranch(x);
    form.setFieldsValue({
      id: x.id,
      name: x.name,
      note: x.note,
      groupSystemId: x.groupSystemId,
      groupSystemName: x.groupSystemName,
    });
    setAddModalOpen(true);
  };

  const handleDeleteTele = async (x: dataBranchModal) => {
    setLoading(true);
    try {
      await deleteGroupBranch(x.id);
      toast.success("Xóa nhóm chi nhánh thành công!");
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
        const data = await getBranchSystem(1, 20);
        const formattedData =
          data?.data?.source?.map((x: dataBranchModal) => ({
            id: x.id,
            name: x.name,
            note: x.note,
            groupSystemId: x.groupSystemId,
            groupSystemName: x.groupSystemName,
          })) || [];

        setDataBranch(formattedData);
      } else {
        const data = await getBranchSystem(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: dataBranchModal) => ({
            id: x.id,
            name: x.name,
            note: x.note,
            groupSystemId: x.groupSystemId,
            groupSystemName: x.groupSystemName,
          })) || [];

        setDataBranch(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài:", error);
      toast.error("Có lỗi xảy ra khi tìm kiếm!");
    }
  };

  const getGroupSystems = async () => {
    try {
      const getSystem = await getGroupSystem(1, 20);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = getSystem?.data?.source?.map((x: any) => ({
        value: x.id,
        label: x.name || "Không xác định",
      }));
      setGroupSystem(res);
    } catch (error) {
      console.error(error);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<dataBranchModal | null>(null);

  const handleDeleteClick = (tele: dataBranchModal) => {
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
    { title: "Tên chi nhánh", dataIndex: "name", key: "name" },
    {
      title: "Thuộc hệ thống",
      dataIndex: "groupSystemName",
      key: "groupSystemName",
    },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    {
      title: "Id hệ thống",
      dataIndex: "groupSystemId",
      key: "groupSystemId",
      hidden: true,
    },
    {
      title: "Chức năng",
      key: "action",
      render: (record: dataBranchModal) => (
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
    fetchGroupSystem();
  }, [checkFilter]);

  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">Danh sách chi nhánh</div>
        <div className="flex justify-between items-center mb-7">
          <Input
            placeholder="Tìm kiếm chi nhánh ..."
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
              setCurrentBranch(null);
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
          <Table columns={columns} dataSource={dataBranch} />
        )}
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        title={currentBranch ? "Chỉnh sửa chi nhánh" : "Thêm mới chi nhánh"}
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
            label="Tên chi nhánh"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên chi nhánh!" },
            ]}
          >
            <Input placeholder="Tên nhóm chi nhánh" />
          </Form.Item>
          <Form.Item label="Hệ thống" name="groupSystemId">
            <Select
              placeholder="Chọn hệ thống"
              onFocus={getGroupSystems}
              options={groupSystem}
              onChange={(value) => {
                setSystemId(value);
                // getBranchSystems();
              }}
              value={systemId}
            />
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
              {currentBranch ? "Cập nhật" : "Thêm mới"}
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

export default GroupBranchPage;
