"use client";

import Header from "@/app/component/Header";
import { Button, Form, Input, Radio, Select, Space, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import BaseModal from "@/app/component/config/BaseModal";

interface DataAccount {
  key: string;
  bank: string;
  account_number: string;
  account_holder: string;
  phone: number;
  group_account: string;
  type_account: string;
  note: string;
}

const options = [
  { value: "company", label: "Tài khoản công ty" },
  { value: "bank", label: "Tài khoản ngân hàng" },
  { value: "telegram", label: "Nhóm chat Telegram" },
  { value: "transaction", label: "Loại giao dịch" },
  { value: "accountGroup", label: "Nhóm tài khoản" },
];

const initialData: DataAccount[] = [
  {
    key: "1",
    bank: "MB",
    account_number: "123123",
    account_holder: "NHD",
    phone: 123123123,
    group_account: "Tổng chi tiêu",
    type_account: "Tài khoản công ty",
    note: "avava",
  },
];

const Account: React.FC = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [currentAccount, setCurrentAccount] = useState<DataAccount | null>(
    null
  );
  const [dataAccounts, setDataAccounts] = useState<DataAccount[]>(initialData);

  const onSearch = (value: string) => console.log("Search value:", value);

  const handleAddConfirm = () => {
    const formData = form.getFieldsValue();
    if (currentAccount) {
      setDataAccounts((prev) =>
        prev.map((account) =>
          account.key === currentAccount.key
            ? { ...currentAccount, ...formData }
            : account
        )
      );
    } else {
      setDataAccounts((prev) => [
        ...prev,
        { key: Date.now().toString(), ...formData },
      ]);
    }
    setAddModalOpen(false);
    form.resetFields(); // Reset fields after adding or editing
    setCurrentAccount(null);
  };

  const handleEditAccount = (account: DataAccount) => {
    setCurrentAccount(account);
    form.setFieldsValue(account);
    setAddModalOpen(true);
  };

  const handleDeleteAccount = (account: DataAccount) => {
    Modal.confirm({
      title: "Xóa tài khoản ngân hàng",
      content: `Bạn có chắc chắn chấp nhận xóa tài khoản ngân hàng ${account.account_holder} này không?`,
      onOk: () => {
        setDataAccounts((prev) => prev.filter((a) => a.key !== account.key));
      },
    });
  };

  const columns = [
    { title: "Ngân hàng", dataIndex: "bank", key: "bank" },
    {
      title: "Số tài khoản",
      dataIndex: "account_number",
      key: "account_number",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "account_holder",
      key: "account_holder",
    },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Nhóm tài khoản",
      dataIndex: "group_account",
      key: "group_account",
    },
    { title: "Loại tài khoản", dataIndex: "type_account", key: "type_account" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    {
      title: "Chức năng",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: any, record: DataAccount) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditAccount(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteAccount(record)}
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
        <div className="text-[32px] font-bold py-5">Danh sách tài khoản</div>
        <div className="flex justify-between items-center mb-7">
          <div className="flex items-center">
            <Input
              placeholder="Số tài khoản, tên tài khoản ..."
              onPressEnter={(e) => onSearch(e.currentTarget.value)}
              style={{
                width: 253,
                borderRadius: 10,
                height: 38,
                marginRight: 15,
              }}
            />
            <Space direction="horizontal" size="middle">
              {["Nhóm tài khoản", "Loại tài khoản", "Tên ngân hàng"].map(
                (placeholder, index) => (
                  <Select
                    key={index}
                    options={options}
                    placeholder={placeholder}
                    style={{ width: 245 }}
                  />
                )
              )}
            </Space>
          </div>
          <Button
            className="bg-[#4B5CB8] w-[136px] h-[40px] text-white font-medium hover:bg-[#3A4A9D]"
            onClick={() => {
              setCurrentAccount(null);
              form.resetFields();
              setAddModalOpen(true);
            }}
          >
            Thêm mới
          </Button>
        </div>
        <Table columns={columns} dataSource={dataAccounts} />
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields(); // Reset fields when closing modal
        }}
        title={currentAccount ? "Chỉnh sửa tài khoản" : "Thêm mới tài khoản"}
        offPadding
      >
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Chọn ngân hàng"
              name="bank"
              rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
            >
              <Select options={options} placeholder="Chọn ngân hàng" />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Số tài khoản"
              name="account_number"
              rules={[
                { required: true, message: "Vui lòng nhập số tài khoản!" },
              ]}
            >
              <Input placeholder="Nhập số tài khoản" />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Nhập tên chủ tài khoản"
              name="account_holder"
              rules={[
                { required: true, message: "Vui lòng nhập tên chủ tài khoản!" },
              ]}
            >
              <Input placeholder="Nhập tên chủ tài khoản" />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Chọn loại tài khoản"
              name="type_account"
              rules={[
                { required: true, message: "Vui lòng chọn loại tài khoản!" },
              ]}
            >
              <Select options={options} placeholder="Chọn loại tài khoản" />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <Form.Item label="Lấy giao dịch từ">
              <Radio.Group
                onChange={(e) => setValue(e.target.value)}
                value={value}
              >
                <Space direction="vertical">
                  <Radio value={1}>Giao dịch từ SMS</Radio>
                  <Radio value={2}>Giao dịch từ Email</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Chọn Số điện thoại nhận SMS"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Select options={options} placeholder="Chọn số điện thoại" />
            </Form.Item>
          </div>
          <Form.Item label="Chọn nhóm tài khoản">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              options={options}
            />
          </Form.Item>
          <Form.Item label="Ghi chú">
            <Input.TextArea rows={4} />
          </Form.Item>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setAddModalOpen(false);
                form.resetFields();
              }}
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
              {currentAccount ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
    </>
  );
};

export default Account;
