"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/component/Header";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BaseModal from "@/app/component/config/BaseModal";
import { addRole, deleteRole, getRole } from "@/app/services/role";
import { getGroupSystem } from "@/app/services/groupSystem";
import { getBranchSystem } from "@/app/services/branchSystem";
import { getGroupTeam } from "@/app/services/groupTeam";
import { toast } from "react-toastify";
import DeleteModal from "@/app/component/config/modalDelete";
import { useRouter } from "next/navigation";

export interface dataRole {
  id: number;
  userName: string;
  email: string;
  fullName: string;
  role: string;
  password: string;
  isAdmin?: boolean;
  groupSystemId?: number;
  groupBranchId?: number;
  groupTeamId?: number;
}

interface filterRole {
  Name: string;
  Value: string;
}

const Role = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/pages/login");
    }
  }, []);

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
  const [role, setRole] = useState(false);

  const [keys, setKeys] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<string | null>(null);
  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchListRole = async (globalTerm?: string) => {
    const arrRole: filterRole[] = [];
    const addedParams = new Set<string>();
    arrRole.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    // setLoading(true);
    try {
      const response = await getRole(pageIndex, pageSize, globalTerm, arrRole);
      console.log(response, "Role");
      const formattedData =
        response?.data?.source?.map((x: dataRole) => ({
          id: x.id,
          userName: x.userName,
          role: x.role,
          email: x.email,
          fullName: x.fullName,
          isAdmin: x.isAdmin,
          groupSystemId: x.groupSystemId,
          groupBranchId: x.groupBranchId,
          groupTeamId: x.groupTeamId,
          password: x.password,
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
    // const formData = form.getFieldsValue();
    setLoading(true);
    try {
      await form.validateFields();
      setAddModalOpen(false);
      const formData = form.getFieldsValue();
      const roleData = {
        id: currentRole ? currentRole.id : formData.id,
        userName: formData.userName,
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        isAdmin: formData.isAdmin,
        groupSystemId: formData.groupSystemId,
        groupBranchId: formData.groupBranchId,
        groupTeamId: formData.groupTeamId,
        password: formData.password,
      };

      // Gửi dữ liệu vai trò tới máy chủ và lưu phản hồi
      const response = await addRole(roleData);

      // Kiểm tra phản hồi từ máy chủ
      if (response && response.success === false) {
        throw new Error(response.message || "Có lỗi xảy ra, vui lòng thử lại!");
      }

      setAddModalOpen(false);
      form.resetFields();
      setCurrentRole(null);
      await fetchListRole();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Lỗi:", error);

      if (error && typeof error === "object" && "message" in error) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  // sửa
  const handleEdit = (record: dataRole) => {
    console.log("data edit", record);
    setCurrentRole(record);
    form.setFieldsValue({
      id: record.id,
      userName: record.userName,
      email: record.email,
      fullName: record.fullName,
      role: record.role,
      isAdmin: record.isAdmin,
      groupSystemId: record.groupSystemId,
      groupBranchId: record.groupBranchId,
      groupTeamId: record.groupTeamId,
      password: record.password,
    });
    setAddModalOpen(true);
  };

  const handleDeleteRole = async (role: dataRole) => {
    setLoading(true);
    try {
      setAddModalOpen(false);
      await deleteRole(role.id);
      await fetchListRole();
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
    } finally {
      setLoading(false);
      toast.success("Xóa nhóm quyền thành công");
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
    { title: "Vai trò", dataIndex: "role", key: "role" },
    {
      title: "Hệ thống",
      dataIndex: "groupSystemId",
      key: "groupSystemId",
      hidden: true,
    },
    {
      title: "Chi nhánh",
      dataIndex: "groupBranchId",
      key: "groupBranchId",
      hidden: true,
    },
    {
      title: "Đội nhóm",
      dataIndex: "groupTeamId",
      key: "groupTeamId",
      hidden: true,
    },
    {
      title: "Chức năng",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (record: dataRole) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
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
        <div className="text-[32px] font-bold py-5">Danh sách quyền</div>
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
        title={currentRole ? "Chỉnh sửa quyền" : "Thêm mới quyền"}
      >
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col gap-1 w-full"
        >
          <Form.Item hidden label="id" name="id">
            <Input hidden />
          </Form.Item>

          <Form.Item label="Vai trò" name="isAdmin" valuePropName="checked">
            <Checkbox
              onChange={(e) => {
                setRole(e.target.checked);
              }}
              checked={role}
            >
              Admin
            </Checkbox>
          </Form.Item>

          {!role && (
            <>
              <Form.Item label="Hệ thống" name="groupSystemId">
                <Select
                  allowClear
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
              <Form.Item label="Chọn chi nhánh" name="groupBranchId">
                <Select
                  allowClear
                  placeholder="Chọn chi nhánh"
                  onFocus={getBranchSystems}
                  options={branchSystem}
                  onChange={(value) => {
                    setParentId(value);
                    getGroupTeams();
                  }}
                  value={parentId}
                />
              </Form.Item>
              <Form.Item label="Chọn đội nhóm" name="groupTeamId">
                <Select
                  allowClear
                  placeholder="Chọn đội nhóm"
                  onFocus={getGroupTeams}
                  options={groupTeam}
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Họ và tên" />
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
