"use client";

import Header from "@/app/component/Header";
import { Button, Form, Input, Select, Space, Table, Modal, Radio } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import BaseModal from "@/app/component/config/BaseModal";
import {
  addBankAccounts,
  deleteBankAccount,
  fetchBankAccounts,
  getBank,
} from "@/app/services/bankAccount";
import {
  BankAccounts,
  DataAccount,
} from "@/app/component/modal/modalBankAccount";
import { getListPhone } from "@/app/services/phone";
import { getAccountGroup } from "@/app/services/accountGroup";
import { getGroupSystem } from "@/app/services/groupSystem";
import { getBranchSystem } from "@/app/services/branchSystem";
import { getGroupTeam } from "@/app/services/groupTeam";

const accountTypeOptions = [
  { value: "company", label: "Tài khoản công ty" },
  { value: "marketing", label: "Tài khoản marketing" },
];

const accountGroupOptions = [
  { value: 1, label: "Nhóm Tài Khoản 1" },
  { value: 2, label: "Nhóm Tài Khoản 2" },
  { value: 3, label: "Nhóm Tài Khoản 3" },
];

const Account: React.FC = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<DataAccount | null>(
    null
  );
  const [dataAccount, setDataAccount] = useState<DataAccount[]>([]);
  const [banks, setBanks] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [accountGroup, setAccountGroup] = useState([]);
  const [groupSystem, setGroupSystem] = useState([]);
  const [branchSystem, setBranchSystem] = useState([]);
  const [groupTeam, setGroupTeam] = useState([]);
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);
  const [grandparentId, setGrandparentId] = useState<number>(0);
  const [parentId, setParentId] = useState<number>(0);
  const [value, setValue] = useState("1");

  const fetchAccounts = async () => {
    try {
      const response = await fetchBankAccounts(1, 20);
      const formattedData =
        response?.data?.source?.map((account: BankAccounts) => ({
          key: account.id,
          bank: account.bank?.code || "",
          account_number: account.accountNumber,
          account_holder: account.fullName,
          phone: account.phoneId || "",
          SelectedAccountGroups: account.SelectedAccountGroups,
          type_account: account.typeAccountDescription,
          note: account.notes,
        })) || [];
      setDataAccount(formattedData);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchBankData = async () => {
    try {
      const bankData = await getBank(pageIndex, pageSize);
      const formattedBanks =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bankData?.data?.source?.map((bank: any) => ({
          value: bank.id,
          label: bank.fullName || bank.code || "Không xác định",
        })) || [];
      setBanks(formattedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const getListPhoneNumber = async () => {
    try {
      const phone = await getListPhone(pageIndex, pageSize);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = phone?.data?.source?.map((x: any) => ({
        value: x.id,
        label: x.number || "Không xác định",
      }));
      setPhoneNumber(res);
    } catch (error) {
      console.error(error);
    }
  };

  const getListAccountGroup = async () => {
    try {
      const accountGroup = await getAccountGroup(pageIndex, pageSize);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = accountGroup?.data?.source?.map((x: any) => ({
        value: x.id,
        label: x.fullName || "Không xác định",
      }));
      setAccountGroup(res);
    } catch (error) {
      console.error(error);
    }
  };

  const getGroupSystems = async () => {
    try {
      const getSystem = await getGroupSystem(pageIndex, pageSize);
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
      const getBranch = await getBranchSystem(
        grandparentId,
        pageIndex,
        pageSize
      );
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
      const groupTeams = await getGroupTeam(
        grandparentId,
        parentId,
        pageIndex,
        pageSize
      );
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
    console.log("Form Data:", formData);

    try {
      // Gọi API thêm tài khoản ngân hàng
      const result = await addBankAccounts({
        bankId: formData.bank,
        accountNumber: formData.account_number,
        fullName: formData.account_holder,
        notes: formData.note,
        phoneId: formData.phone,
        SelectedAccountGroups: formData.SelectedAccountGroups,
        typeAccount: formData.type_account || "Tài khoản cá nhân",
        TransactionSource: formData.TransactionSource,
        bank: formData.bank,
      });

      // Thêm tài khoản mới vào danh sách
      const newAccount = {
        key: result.id || Date.now().toString(),
        bank: formData.bank,
        account_number: formData.account_number,
        account_holder: formData.account_holder,
        phone: formData.phone,
        SelectedAccountGroups: formData.SelectedAccountGroups,
        type_account: formData.type_account,
        note: formData.note,
        TransactionSource: formData.TransactionSource,
        groupSystem: formData.groupSystem,
        branchSystem: formData.branchSystem,
        groupTeam: formData.groupTeam,
      };

      setDataAccount((prev) => [...prev, newAccount]);
      await fetchAccounts();
    } catch (error) {
      console.error("Lỗi khi thêm tài khoản ngân hàng:", error);
    } finally {
      setAddModalOpen(false);
      form.resetFields();
      setCurrentAccount(null);
    }
  };

  const handleEditAccount = (account: DataAccount) => {
    setCurrentAccount(account);
    form.setFieldsValue(account);
    setAddModalOpen(true);
  };

  const handleDeleteAccount = (account: DataAccount) => {
    Modal.confirm({
      title: "Xóa tài khoản ngân hàng",
      content: `Bạn có chắc chắn chấp nhận xóa tài khoản ngân hàng ${account.bank} này không?`,
      onOk: async () => {
        try {
          await deleteBankAccount(account.key);
          await fetchAccounts();
        } catch (error) {
          console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
        }
      },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleValueChange = (newValue: any) => {
    setValue(newValue);
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
      dataIndex: "SelectedAccountGroups",
      key: "SelectedAccountGroups",
    },
    { title: "Loại tài khoản", dataIndex: "type_account", key: "type_account" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    {
      title: "Chức năng",
      key: "action",
      render: (record: BankAccounts) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditAccount(record as unknown as DataAccount)}
          >
            Chỉnh sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteAccount(record as unknown as DataAccount)}
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
              onPressEnter={(e) =>
                console.log("Search value:", e.currentTarget.value)
              }
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
                    options={accountGroupOptions}
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
        <Table columns={columns} dataSource={dataAccount} />
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        title={currentAccount ? "Chỉnh sửa tài khoản" : "Thêm mới tài khoản"}
        offPadding
      >
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col gap-1 w-full"
        >
          <Form.Item
            label="Chọn loại tài khoản"
            name="type_account"
            rules={[
              { required: true, message: "Vui lòng chọn loại tài khoản!" },
            ]}
          >
            <Select
              options={accountTypeOptions}
              placeholder="Chọn loại tài khoản"
            />
          </Form.Item>
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Chọn hệ thống"
              name="groupSystem"
              rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
            >
              <Select
                placeholder="Chọn hệ thống"
                onFocus={getGroupSystems}
                options={groupSystem}
                onChange={(value) => {
                  setGrandparentId(value);
                  getBranchSystems();
                }}
                value={grandparentId}
              />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Chọn chi nhánh"
              name="branchSystem"
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
                value={grandparentId}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Chọn đội nhóm"
              name="groupTeam"
              rules={[{ required: true, message: "Vui lòng chọn đội nhóm!" }]}
            >
              <Select
                placeholder="Chọn ngân hàng"
                onFocus={getGroupTeams}
                options={groupTeam}
              />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Chọn ngân hàng"
              name="bank"
              rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
            >
              <Select
                placeholder="Chọn ngân hàng"
                onFocus={fetchBankData}
                options={banks}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between">
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
          </div>
          <div className="flex justify-between">
            <Form.Item label="Lấy giao dịch từ" name="TransactionSource">
              <Radio.Group
                onChange={(e) => handleValueChange(e.target.value)}
                value={value}
              >
                <Space direction="vertical" defaultValue={1}>
                  <Radio value={"1"}>Giao dịch từ SMS</Radio>
                  <Radio value={"2"}>Giao dịch từ Email</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            {value === "1" && (
              <Form.Item
                className="w-[45%]"
                label="Nhập số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Select
                  options={phoneNumber}
                  onFocus={getListPhoneNumber}
                  placeholder="Chọn số điện thoại"
                />
              </Form.Item>
            )}
          </div>
          <Form.Item
            label="Chọn nhóm tài khoản"
            name="SelectedAccountGroups"
            rules={[
              { required: true, message: "Vui lòng chọn nhóm tài khoản!" },
            ]}
          >
            <Select
              options={accountGroup}
              placeholder="Chọn nhóm tài khoản"
              mode="multiple"
              onFocus={getListAccountGroup}
            />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea
              placeholder="Nhập ghi chú"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleAddConfirm}
              className="w-full h-[40px] bg-[#4B5CB8] hover:bg-[#3A4A9D]"
            >
              {currentAccount ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </BaseModal>
    </>
  );
};

export default Account;