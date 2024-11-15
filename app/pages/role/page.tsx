"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/component/Header";
import { Button, Form, Input, Select, Space, Spin, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BaseModal from "@/app/component/config/BaseModal";
import { addRole, deleteRole, getRole } from "@/app/services/role";
import { getGroupSystem } from "@/app/services/groupSystem";
import { getBranchSystem } from "@/app/services/branchSystem";
import { getGroupTeam } from "@/app/services/groupTeam";
import { toast } from "react-toastify";
import DeleteModal from "@/app/component/config/modalDelete";

export interface dataRole {
  id: number;
  userName: string;
  email: string;
  fullName: string;
}

interface filterRole {
  Name: string;
  Value: string;
}

const Role = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [dataRole, setDataRole] = useState<dataRole[]>([]);
  const [currentRole, setCurrentRole] = useState<dataRole | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [globalTerm, setGlobalTerm] = useState("");
  const [groupSystem, setGroupSystem] = useState([]);
  const [branchSystem, setBranchSystem] = useState([]);
  const [groupTeam, setGroupTeam] = useState([]);
  const [systemId, setSystemId] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [parentId, setParentId] = useState<number>(0);
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  const [keys, setKeys] = useState<string | null>(null);
  const [values, setValues] = useState<string | null>(null);
  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchListRole = async (globalTerm?: string) => {
    const arrRole: filterRole[] = [];
    const obj: filterRole = {
      Name: keys!,
      Value: values!,
    };
    arrRole.push(obj);
    // setLoading(true);
    try {
      const response = await getRole(pageIndex, pageSize, globalTerm, arrRole);
      // console.log(response, "Role");
      const formattedData =
        response?.data?.source?.map((x: dataRole) => ({
          id: x.id?.toString() || Date.now().toString(),
          userName: x.userName,
          fullName: x.fullName,
          // thêm 1 trường vai trò nữa, tạm thời chưa có trên API
        })) || [];
      setDataRole(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchListRole(globalTerm);
  }, [globalTerm]);

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

  const getBranchSystems = async () => {
    try {
      const getBranch = await getBranchSystem(1, 20);
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

  const getGroupTeams = async () => {
    try {
      const groupTeams = await getGroupTeam(1, 20);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = groupTeams?.data?.source?.map((x: any) => ({
        value: x.id,
        label: x.name || "Không xác định",
      }));
      setGroupTeam(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddConfirm = async () => {
    const formData = form.getFieldsValue();
    setLoading(true);
    try {
      if (currentRole) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await addRole({
          id: currentRole.id,
          userName: "",
          email: "",
          fullName: "",
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await addRole({
          id: formData.id,
          userName: "",
          email: "",
          fullName: "",
        });
      }

      setAddModalOpen(false);
      form.resetFields();
      setCurrentRole(null);
      setLoading(false);
      await fetchListRole();
    } catch (error) {
      console.error("Lỗi:", error);
      setLoading(false);
    }
  };

  // sửa

  const handleDeleteRole = async (role: dataRole) => {
    setLoading(true);
    try {
      await deleteRole(role.id);
      await fetchListRole();
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
    } finally {
      setLoading(false);
      toast.success("Xóa tài khoản thành công");
    }
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    try {
      if (value.trim() === "") {
        const data = await getRole(1, 20);
        const formattedData =
          data?.data?.source?.map((x: dataRole) => ({
            id: x.id,
            userName: x.userName,
            fullName: x.fullName,
          })) || [];

        setDataRole(formattedData);
      } else {
        // Nếu có giá trị tìm kiếm, gọi API với giá trị đó
        const data = await getRole(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: dataRole) => ({
            id: x.id,
            userName: x.userName,
            fullName: x.fullName,
          })) || [];

        setDataRole(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản ngân hàng:", error);
    }
  };

  // fetch để gọi ra danh sách theo value search
  useEffect(() => {
    fetchListRole();
  }, [keys]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<dataRole | null>(null);

  const handleDeleteClick = (tele: dataRole) => {
    setSelectedAccountGroup(tele);
    setIsDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedAccountGroup(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAccountGroup) {
      handleDeleteRole(selectedAccountGroup);
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    { title: "id", dataIndex: "id", key: "id" },
    { title: "Email đăng nhập", dataIndex: "userName", key: "userName" },
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    { title: "Vai trò", dataIndex: "", key: "" },
    {
      title: "Chức năng",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (record: dataRole) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            // onClick={() => handleEditTele(record)}
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
  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">Danh sách nhóm quyền</div>
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
              setCurrentRole(null);
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
          <Table columns={columns} dataSource={dataRole} />
        )}
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        title={
          currentRole
            ? "Chỉnh sửa vai trò hệ thống"
            : "Thêm mới vai trò hệ thống"
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
            label="Chọn vai trò"
            name=""
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Input placeholder="Chọn vai trò" />
          </Form.Item>
          <Form.Item
            label="Hệ thống"
            name="groupSystemId"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn hệ thống!",
              },
            ]}
          >
            <Select
              placeholder="Chọn hệ thống"
              onFocus={getGroupSystems}
              options={groupSystem}
              onChange={(value) => {
                setSystemId(value);
                getBranchSystems();
              }}
              value={systemId}
            />
          </Form.Item>
          <Form.Item
            label="Chọn chi nhánh"
            name="groupBranchId"
            rules={[{ required: true, message: "Vui lòng chọn chi nhánh!" }]}
          >
            <Select
              placeholder="Chọn chi nhánh"
              onFocus={getBranchSystems}
              options={branchSystem}
              onChange={(value) => {
                setParentId(value);
                getGroupTeams();
              }}
              value={systemId}
            />
          </Form.Item>
          <Form.Item
            label="Chọn đội nhóm"
            name="groupTeamId"
            rules={[{ required: true, message: "Vui lòng chọn đội nhóm!" }]}
          >
            <Select
              placeholder="Chọn đội nhóm"
              onFocus={getGroupTeams}
              options={groupTeam}
            />
          </Form.Item>
          <Form.Item
            label="Email đăng nhập"
            name="userName"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input placeholder="Email đăng nhập" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
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
              {currentRole ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
      <DeleteModal
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        role={selectedAccountGroup}
      />
    </>
  );
};
export default Role;
