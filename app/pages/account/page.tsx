"use client";

import Header from "@/app/component/Header";
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Table,
  Modal,
  Radio,
  Spin,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import BaseModal from "@/app/component/config/BaseModal";
import {
  addBankAccounts,
  deleteBankAccount,
  fetchBankAccounts,
  getBank,
} from "@/app/services/bankAccount";
import { BankAccounts } from "@/app/component/modal/modalBankAccount";
import { getListPhone } from "@/app/services/phone";
import { getAccountGroup } from "@/app/services/accountGroup";
import { getGroupSystem } from "@/app/services/groupSystem";
import { getBranchSystem } from "@/app/services/branchSystem";
import { getGroupTeam } from "@/app/services/groupTeam";
import { toast } from "react-toastify";

const accountTypeOptions = [
  { value: "company", label: "Tài khoản công ty" },
  { value: "marketing", label: "Tài khoản marketing" },
];

const Account: React.FC = () => {
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<BankAccounts | null>(
    null
  );
  const [dataAccount, setDataAccount] = useState<BankAccounts[]>([]);
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
  const [globalTerm, setGlobalTerm] = useState("");
  const [searchTerms] = useState("");
  const [loading, setLoading] = useState(false);
  // const [selectedGroup, setSelectedGroup] = useState(null);

  const fetchAccounts = async (globalTerm = "") => {
    setLoading(true);
    try {
      const response = await fetchBankAccounts(pageIndex, pageSize, globalTerm);
      console.log(response, "fetchBankAccounts");

      const formattedData =
        response?.data?.source?.map((account: BankAccounts) => ({
          id: account.id,
          bank: account.bank?.code,
          accountNumber: account.accountNumber,
          fullName: account.fullName,
          phone: account.phone?.number,
          phoneId: account.phoneId,
          SelectedAccountGroups: account.typeGroupAccountString,
          typeAccount: account.typeAccount,
          notes: account.notes,
        })) || [];
      setDataAccount(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản ngân hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(globalTerm);
  }, [globalTerm]);

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
      const accountGroup = await getAccountGroup(
        pageIndex,
        pageSize,
        searchTerms
      );
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

  useEffect(() => {
    getListAccountGroup();
  }, [searchTerms]);

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
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await addBankAccounts({
        id: formData.id,
        bank: formData.bank,
        accountNumber: formData.accountNumber,
        fullName: formData.fullName,
        phoneId: formData.phoneId,
        phone: formData.phone,
        SelectedAccountGroups: formData.SelectedAccountGroups,
        typeAccount: formData.typeAccount,
        notes: formData.notes,
        TransactionSource: formData.TransactionSource,
      });
      console.log(res, "res");

      setAddModalOpen(false);
      form.resetFields();
      setCurrentAccount(null);
      setLoading(false);
      await fetchAccounts();
      toast.success("Thêm mới thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm tài khoản ngân hàng:", error);
      setLoading(false);
      setAddModalOpen(false);
      toast.error("Thêm mới lỗi");
    }
  };

  const handleEditAccount = (account: BankAccounts) => {
    console.log("data edit", account);
    setCurrentAccount(account);
    form.setFieldsValue({
      id: account.id,
      bank: account.bank,
      accountNumber: account.accountNumber,
      fullName: account.fullName,
      phoneId: account.phoneId,
      phone: account.phone,
      SelectedAccountGroups: account.SelectedAccountGroups,
      typeAccount: account.typeAccount,
      notes: account.notes,
      TransactionSource: account.TransactionSource,
    });
    setAddModalOpen(true);
  };

  const handleDeleteAccount = (account: BankAccounts) => {
    Modal.confirm({
      title: "Xóa tài khoản ngân hàng",
      content: `Bạn có chắc chắn chấp nhận xóa tài khoản ngân hàng ${account.bank} này không?`,
      onOk: async () => {
        setLoading(true);
        try {
          await deleteBankAccount(account.id);
          await fetchAccounts();
        } catch (error) {
          console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
        } finally {
          setLoading(false);
          toast.success("Xóa tài khoản thành công");
        }
      },
    });
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    try {
      if (value.trim() === "") {
        const data = await fetchBankAccounts(pageIndex, pageSize);
        const formattedData =
          data?.data?.source?.map((account: BankAccounts) => ({
            id: account.id,
            bank: account.bank,
            accountNumber: account.accountNumber,
            fullName: account.fullName,
            phoneId: account.phoneId,
            phone: account.phone,
            SelectedAccountGroups: account.SelectedAccountGroups,
            typeAccount: account.typeAccount,
            notes: account.notes,
            TransactionSource: account.TransactionSource,
          })) || [];

        setDataAccount(formattedData);
      } else {
        // Nếu có giá trị tìm kiếm, gọi API với giá trị đó
        const data = await fetchBankAccounts(pageIndex, pageSize, value);
        const formattedData =
          data?.data?.source?.map((account: BankAccounts) => ({
            id: account.id,
            bank: account.bank,
            accountNumber: account.accountNumber,
            fullName: account.fullName,
            phoneId: account.phoneId,
            phone: account.phone,
            SelectedAccountGroups: account.SelectedAccountGroups,
            typeAccount: account.typeAccount,
            notes: account.notes,
            TransactionSource: account.TransactionSource,
          })) || [];

        setDataAccount(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản ngân hàng:", error);
    }
  };
  // fetch để gọi ra danh sách theo value search
  useEffect(() => {
    fetchAccounts();
  }, []);

  // const handleFilterChange = (value: string) => {
  //   setSearchTerms(value);
  // };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleValueChange = (newValue: any) => {
    setValue(newValue);
  };

  const columns = [
    { title: "id", dataIndex: "id", key: "id" },
    { title: "Ngân hàng", dataIndex: "bank", key: "bank" },
    {
      title: "Số tài khoản",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "fullName",
      key: "fullName",
    },
    { title: "phoneId", dataIndex: "phoneId", key: "phoneId", hidden: true },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Nhóm tài khoản",
      dataIndex: "SelectedAccountGroups",
      key: "SelectedAccountGroups",
    },
    { title: "Loại tài khoản", dataIndex: "typeAccount", key: "typeAccount" },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Chức năng",
      key: "action",
      render: (record: BankAccounts) => (
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
              onChange={(e) => {
                const value = e.target.value;
                handleSearch(value);
              }}
              onPressEnter={async (e) => {
                handleSearch(e.currentTarget.value);
              }}
              style={{
                width: 253,
                borderRadius: 10,
                height: 38,
                marginRight: 15,
              }}
            />
            {/* <Space direction="horizontal" size="middle">
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
            </Space> */}
            <Space direction="horizontal" size="middle">
              {["Nhóm tài khoản", "Loại tài khoản", "Tên ngân hàng"].map(
                (placeholder, index) => (
                  <Select
                    allowClear
                    key={index}
                    options={accountGroup}
                    style={{ width: 245 }}
                    placeholder={placeholder}
                    // onChange={handleFilterChange}
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
        {loading ? (
          <Spin spinning={loading} fullscreen />
        ) : (
          <Table columns={columns} dataSource={dataAccount} />
        )}
        {/* <Table columns={columns} dataSource={dataAccount} /> */}
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
          <Form.Item hidden label="id" name="id">
            <Input />
          </Form.Item>
          {/* Loại tài khoản */}
          <Form.Item
            label="Chọn loại tài khoản"
            name="typeAccount"
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
              rules={[{ required: true, message: "Vui lòng chọn hệ thống!" }]}
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
                placeholder="Chọn đội nhóm"
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
              name="accountNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số tài khoản!" },
              ]}
            >
              <Input placeholder="Nhập số tài khoản" />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Nhập tên chủ tài khoản"
              name="fullName"
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
                  <Radio value={"1"} defaultChecked>
                    Giao dịch từ SMS
                  </Radio>
                  <Radio value={"2"}>Giao dịch từ Email</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            {value === "1" && (
              <Form.Item
                className="w-[45%]"
                label="Nhập số điện thoại"
                name="phoneId"
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
              // <Form.Item label="Nhập số điện thoại" name="phoneId">
              //   <Select
              //     options={phoneNumber}
              //     onFocus={getListPhoneNumber}
              //     placeholder="Chọn số điện thoại"
              //   />
              // </Form.Item>
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
          <Form.Item label="Ghi chú" name="notes">
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
