"use client";

import React, { useState } from "react";
import Header from "@/app/component/Header";
import { Button, Form, Input, Select, Space, Spin, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BaseModal from "@/app/component/config/BaseModal";

export interface dataRole {
  id: number;
}

const Role = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataRole, setDataRole] = useState<dataRole[]>([]);
  const [currentRole, setCurrentRole] = useState<dataRole | null>(null);

  const columns = [
    { title: "id", dataIndex: "id", key: "id" },
    { title: "Họ và tên", dataIndex: "", key: "" },
    { title: "Email đăng nhập", dataIndex: "", key: "" },
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
            // onClick={() => handleDeleteTele(record)}
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
            // onChange={(e) => {
            //   const value = e.target.value;
            //   handleSearch(value);
            // }}
            // onPressEnter={async (e) => {
            //   handleSearch(e.currentTarget.value);
            // }}
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
            name=""
            rules={[
              {
                required: true,
                message: "Vui lòng chọn hệ thống!",
              },
            ]}
          >
            <Input placeholder="Vui lòng chọn hệ thống" />
          </Form.Item>
          <Form.Item
            label="Chọn chi nhánh"
            name="branchSystem"
            rules={[{ required: true, message: "Vui lòng chọn chi nhánh!" }]}
          >
            <Select placeholder="Chọn chi nhánh" />
          </Form.Item>
          <Form.Item
            label="Chọn đội nhóm"
            name="groupTeam"
            rules={[{ required: true, message: "Vui lòng chọn đội nhóm!" }]}
          >
            <Select
              placeholder="Chọn ngân hàng"
              //   onFocus={getGroupTeams}
              //   options={groupTeam}
            />
          </Form.Item>
          <Form.Item
            label="Email đăng nhập"
            name=""
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
              //   onClick={handleAddConfirm}
              className="bg-[#4B5CB8] border text-white font-medium w-[189px] h-[42px]"
            >
              {currentRole ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
    </>
  );
};
export default Role;
