"use client";

import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "@/src/component/Header";
import { Button, Form, Input, Select, Space, Spin, Table } from "antd";
import BaseModal from "@/src/component/config/BaseModal";
import { toast } from "react-toastify"; // Import toast
import DeleteModal from "@/src/component/config/modalDelete";
import { getGroupSystem } from "@/src/services/groupSystem";
import {
  addGroupTeam,
  deleteGroupTeam,
  getGroupTeam,
} from "@/src/services/groupTeam";
import { getBranchSystem } from "@/src/services/branchSystem";
import { useRouter } from "next/navigation";

export interface dataTeamModal {
  id: number;
  name: string;
  note: string;
  groupSystemId: number;
  groupSystemName: string;
  groupBranchId: number;
  groupBranchName: string;
}

interface filterRole {
  Name: string;
  Value: string;
}

const GroupTeamPage = () => {
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
  const [currentTeam, setCurrentTeam] = useState<dataTeamModal | null>(null);
  const [dataTeam, setDataTeam] = useState<dataTeamModal[]>([]);
  const [, setGlobalTerm] = useState("");
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  const [keys, setKeys] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<string | null>(null);
  const [groupSystem, setGroupSystem] = useState([]);
  const [systemId, setSystemId] = useState<number>(0);
  const [branchSystem, setBranchSystem] = useState([]);
  const [parentId, setParentId] = useState<number>(0);
  const [isAddGroupTeam, setIsAddGroupTeam] = useState<boolean>(false);

  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchGroupSystem = async (globalTerm?: string) => {
    const arrRole: filterRole[] = [];
    const addedParams = new Set<string>();
    arrRole.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    try {
      const response = await getGroupTeam(
        pageIndex,
        pageSize,
        globalTerm,
        arrRole
      );
      const formattedData =
        response?.data?.source?.map((x: dataTeamModal) => ({
          id: x.id,
          name: x.name,
          note: x.note,
          groupSystemId: x.groupSystemId,
          groupSystemName: x.groupSystemName,
          groupBranchId: x.groupBranchId,
          groupBranchName: x.groupBranchName,
        })) || [];
      setDataTeam(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchGroupSystem();
  }, [keys]);

  const handleAddConfirm = async (isAddGroupTeam: boolean) => {
    try {
      await form.validateFields();
      setAddModalOpen(false);
      setIsAddGroupTeam(isAddGroupTeam);
      const formData = form.getFieldsValue();
      setLoading(true);
      const response = await addGroupTeam({
        id: formData.id,
        name: formData.name,
        note: formData.note,
        groupSystemId: formData.groupSystemId,
        groupSystemName: formData.groupSystemName,
        groupBranchId: formData.groupBranchId,
        groupBranchName: formData.groupBranchName,
      });
      if (response && response.success === false) {
        toast.error(response.message || "Có lỗi xảy ra, vui lòng thử lại!");
        setLoading(false);
        setIsAddGroupTeam(false);
        return;
      }
      setAddModalOpen(false);
      form.resetFields();
      setCurrentTeam(null);
      toast.success(
        currentTeam ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      await fetchGroupSystem();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsAddGroupTeam(false);
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

  const handleEditTele = (x: dataTeamModal) => {
    setCurrentTeam(x);
    form.setFieldsValue({
      id: x.id,
      name: x.name,
      note: x.note,
      groupSystemId: x.groupSystemId,
      groupSystemName: x.groupSystemName,
      groupBranchId: x.groupBranchId,
      groupBranchName: x.groupSystemName,
    });
    setAddModalOpen(true);
  };

  const handleDeleteTele = async (x: dataTeamModal) => {
    setLoading(true);
    try {
      setAddModalOpen(false);
      await deleteGroupTeam(x.id);
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
        const data = await getGroupTeam(1, 20);
        const formattedData =
          data?.data?.source?.map((x: dataTeamModal) => ({
            id: x.id,
            name: x.name,
            note: x.note,
            groupSystemId: x.groupSystemId,
            groupSystemName: x.groupSystemName,
            groupBranchId: x.groupBranchId,
            groupBranchName: x.groupSystemName,
          })) || [];

        setDataTeam(formattedData);
      } else {
        const data = await getGroupTeam(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: dataTeamModal) => ({
            id: x.id,
            name: x.name,
            note: x.note,
            groupSystemId: x.groupSystemId,
            groupSystemName: x.groupSystemName,
            groupBranchId: x.groupBranchId,
            groupBranchName: x.groupSystemName,
          })) || [];

        setDataTeam(formattedData);
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

  const getBranchSystems = async (systemId?: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = {
      Name: "groupSystemId",
      Value: systemId,
    };
    await arr.push(obj);
    try {
      const getBranch = await getBranchSystem(1, 20, undefined, arr);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = getBranch?.data?.source?.map((x: any) => ({
        value: x.id,
        label: x.name || "Không xác định",
      }));
      setBranchSystem(res);
    } catch (error) {
      console.error("Lỗi khi gọi hàm getBranchSystem:", error);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<dataTeamModal | null>(null);

  const handleDeleteClick = (tele: dataTeamModal) => {
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
    { title: "Tên đội nhóm", dataIndex: "name", key: "name" },
    {
      title: "Thuộc hệ thống",
      dataIndex: "groupSystemName",
      key: "groupSystemName",
    },
    {
      title: "Thuộc chi nhánh",
      dataIndex: "groupBranchName",
      key: "groupBranchName",
    },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    {
      title: "Id hệ thống",
      dataIndex: "groupSystemId",
      key: "groupSystemId",
      hidden: true,
    },
    {
      title: "Id chi nhánh",
      dataIndex: "groupBranchId",
      key: "groupBranchId",
      hidden: true,
    },
    {
      title: "Chức năng",
      key: "action",
      render: (record: dataTeamModal) => (
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
        <div className="text-[32px] font-bold py-5">Danh sách đội nhóm</div>
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
            className="bg-[#4B5CB8] w-[136px] !h-10 text-white font-medium hover:bg-[#3A4A9D]"
            onClick={() => {
              setCurrentTeam(null);
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
          <Table columns={columns} dataSource={dataTeam} />
        )}
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        title={currentTeam ? "Chỉnh sửa chi nhánh" : "Thêm mới chi nhánh"}
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
            label="Tên đội nhóm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên đội nhóm!" }]}
          >
            <Input placeholder="Tên nhóm đội nhóm" />
          </Form.Item>
          <Form.Item label="Hệ thống" name="groupSystemId">
            <Select
              placeholder="Chọn hệ thống"
              onFocus={getGroupSystems}
              options={groupSystem}
              onChange={(value) => {
                getBranchSystems(value);
                // console.log(value);
                setSystemId(value);
                // getBranchSystems();
              }}
              value={systemId}
              allowClear
            />
          </Form.Item>
          <Form.Item label="Chọn chi nhánh" name="groupBranchId">
            <Select
              placeholder="Chọn chi nhánh"
              // onFocus={getBranchSystems}
              onFocus={() => {
                const formData = form.getFieldsValue();
                getBranchSystems(formData.groupSystemId);
              }}
              options={branchSystem}
              onChange={(value) => {
                setParentId(value);
                // getGroupTeams();
              }}
              value={parentId}
              allowClear
            />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
          </Form.Item>
          <div className="flex justify-end">
            <Button
              onClick={() => setAddModalOpen(false)}
              className="w-[189px] !h-10"
            >
              Đóng
            </Button>
            <div className="w-5" />
            <Button
              type="primary"
              onClick={() => handleAddConfirm(true)}
              className="bg-[#4B5CB8] border text-white font-medium w-[189px] !h-10"
              loading={isAddGroupTeam}
            >
              {currentTeam ? "Cập nhật" : "Thêm mới"}
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

export default GroupTeamPage;
