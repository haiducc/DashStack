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
import { AxiosError } from "axios";
import HiddenForm from "./form/page";

interface filterGroupAccount {
  Name: string;
  Value: string;
}

const accountTypeOptions = [
  { value: "1", label: "Tài khoản công ty" },
  { value: "2", label: "Tài khoản marketing" },
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
  const [groupSystem, setGroupSystem] = useState([]);
  const [branchSystem, setBranchSystem] = useState([]);
  const [groupTeam, setGroupTeam] = useState([]);
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);
  const [grandparentId, setGrandparentId] = useState<number>(0);
  const [parentId, setParentId] = useState<number>(0);
  const [value, setValue] = useState("1");
  const [globalTerm, setGlobalTerm] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditMode, setIsEditMode] = useState(false);
  const [accountGroup, setAccountGroup] = useState([]);
  // const [searchTerms, setSearchTerms] = useState<
  //   Array<{ Name: string; Value: string }>
  // >([]);

  // const [selectedGroup, setSelectedGroup] = useState(null);

  // API để lấy ra dsach tài khoản
  const fetchAccounts = async (
    globalTerm?: string,
    searchTerms?: string,
    heThong?: string
  ) => {
    const arrBankAccount: filterGroupAccount[] = [];
    const bankAccount: filterGroupAccount = {
      Name: "groupAccountId",
      Value: searchTerms!,
    };
    const heThongs: filterGroupAccount = {
      Name: "heThongId",
      Value: heThong!,
    };
    arrBankAccount.push(bankAccount, heThongs);

    setLoading(true);
    try {
      const response = await fetchBankAccounts(
        pageIndex,
        pageSize,
        globalTerm,
        arrBankAccount
      );

      const formattedData =
        response?.data?.source?.map((account: BankAccounts) => ({
          id: account.id,
          bank: account.bank?.code,
          accountNumber: account.accountNumber,
          fullName: account.fullName,
          phone: account.phone?.number,
          phoneId: account.phoneId,
          selectedAccountGroups: account.typeGroupAccount,
          typeAccount: account.typeAccount,
          notes: account.notes,
          bankId: account.bankId,
          groupSystemId: account.groupSystemId,
          groupBranchId: account.groupBranchId,
          groupTeamId: account.groupTeamId,
          transactionSource: account.transactionSource,
          groupSystem: account.groupSystem,
          groupBranch: account.groupBranch,
          groupTeam: account.groupTeam,
          typeAccountDescription: account.typeAccountDescription,
          typeGroupAccountString: account.typeGroupAccountString,
          groupSystemName: account.groupSystem?.name,
          groupBranchName: account.groupBranch?.name,
          groupTeamName: account.groupTeam?.name,
          bankName: account.bank?.fullName,
        })) || [];

      setDataAccount(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản ngân hàng:", error);
      setDataAccount([]);
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
        pageSize
        // undefined,
        // JSON.stringify(filterArr)
      );
      // console.log("accountGroup", accountGroup);

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
      // console.log("getSystem", getSystem);

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
    // console.log("Form Data trước khi gửi:", formData);
    setLoading(true);
    try {
      const res = await addBankAccounts({
        id: formData.id,
        bank: formData.bank,
        accountNumber: formData.accountNumber,
        fullName: formData.fullName,
        phoneId: formData.phoneId,
        phone: formData.phone,
        selectedAccountGroups: formData.selectedAccountGroups,
        typeAccount: formData.typeAccount,
        notes: formData.notes,
        transactionSource: formData.transactionSource,
        groupSystemId: formData.groupSystemId,
        groupBranchId: formData.groupBranchId,
        groupTeamId: formData.groupTeamId,
        bankId: formData.bankId,
        groupSystem: formData.groupSystem,
        groupBranch: formData.groupBranch,
        groupTeam: formData.groupTeam,
        // bankName: formData.bank?.fullNamed
      });
      // console.log(res, "res");
      if (!res.success) {
        // Nếu không thành công, hiển thị thông báo lỗi
        toast.error(res.message || "Có lỗi xảy ra, vui lòng thử lại.");
      } else {
        // Nếu thành công, thực hiện các hành động tiếp theo
        setAddModalOpen(false);
        form.resetFields();
        setCurrentAccount(null);
        await fetchAccounts();
        toast.success("Thêm mới thành công!");
      }
    } catch (error: unknown) {
      setLoading(false);
      setAddModalOpen(false);

      const axiosError = error as AxiosError;

      if (axiosError.response) {
        const responseData = axiosError.response.data as {
          success: boolean;
          message: string;
          messageCode?: string;
          code: number;
          errors?: string[];
        };

        if (responseData.code === 400) {
          const errorMessage = responseData.message || "Thêm mới lỗi";
          toast.error(errorMessage);

          if (responseData.errors) {
            responseData.errors.forEach((err) => {
              toast.error(err);
            });
          }
        } else {
          toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
      } else {
        toast.error("Lỗi kết nối, vui lòng thử lại.");
      }

      console.error("Lỗi khi thêm tài khoản ngân hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccount = (account: BankAccounts) => {
    setIsEditMode(true);
    setCurrentAccount(account);
    // console.log("data edit", account);
    // console.log(account.bank?.fullName, "account.bank?.fullName");

    form.setFieldsValue({
      id: account.id,
      bank: account.bank,
      accountNumber: account.accountNumber,
      fullName: account.fullName,
      phoneId: account.phoneId,
      phone: account.phone,
      selectedAccountGroups: account.selectedAccountGroups,
      typeAccount: account.typeAccount,
      notes: account.notes,
      transactionSource: account.transactionSource,
      groupSystemId: account.groupSystemId,
      groupBranchId: account.groupBranchId,
      groupTeamId: account.groupTeamId,
      bankId: account.bankId,
      //
      groupSystemName: account.groupSystem?.name,
      groupBranchName: account.groupBranch?.name,
      groupTeamName: account.groupTeam?.name,
      bankName: account.bankName,
    });
    setAddModalOpen(true);
  };

  const handleDeleteAccount = (account: BankAccounts) => {
    Modal.confirm({
      title: "Xóa tài khoản ngân hàng",
      content: `Bạn có chắc chắn chấp nhận xóa tài khoản ngân hàng ${account.bank?.code} này không?`,
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
            selectedAccountGroups: account.selectedAccountGroups,
            typeAccount: account.typeAccount,
            notes: account.notes,
            transactionSource: account.transactionSource,
          })) || [];

        setDataAccount(formattedData);
      } else {
        const data = await fetchBankAccounts(pageIndex, pageSize, value);
        const formattedData =
          data?.data?.source?.map((account: BankAccounts) => ({
            id: account.id,
            bank: account.bank,
            accountNumber: account.accountNumber,
            fullName: account.fullName,
            phoneId: account.phoneId,
            phone: account.phone,
            selectedAccountGroups: account.selectedAccountGroups,
            typeAccount: account.typeAccount,
            notes: account.notes,
            transactionSource: account.transactionSource,
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

  const [accountGroupFilter, setAccountGroupFilter] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [filterParams, setFilterParams] = useState<{
    groupAccountId?: string;
    typeAccount?: string;
  }>({});

  // call api lấy dsach filter nhóm tài khoản
  const handleFilter = async () => {
    try {
      const { groupAccountId } = filterParams;
      const searchParams = groupAccountId
        ? [{ Name: "groupAccountId", Value: groupAccountId }]
        : [];
      const fetchBankAccountAPI = await getAccountGroup(
        pageIndex,
        pageSize,
        globalTerm,
        searchParams //searchTerms
      );
      console.log("fetchBankAccountAPI", fetchBankAccountAPI);

      if (
        fetchBankAccountAPI &&
        fetchBankAccountAPI.data &&
        fetchBankAccountAPI.data.source
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = fetchBankAccountAPI.data.source.map((x: any) => ({
          value: x.id,
          label: x.fullName || "Không xác định",
        }));
        setAccountGroupFilter(res);
      } else {
        setAccountGroupFilter([]);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  useEffect(() => {
    // const { groupAccountId } = filterParams;

    const fetchData = async () => {
      await handleFilter();
      // await fetchAccounts(groupAccountId);
    };

    fetchData();
  }, [filterParams]);

  const [groupAccountFilter ,setGroupAccountFilter] = useState()
  const [typeAccountFilter ,setTypeAccountFilter] = useState()

  const handleSelectChange = (groupAccount?: string, heThong?: string) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      groupAccountId: groupAccount,
      typeAccount: heThong,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleValueChange = (newValue: any) => {
    setValue(newValue);
  };

  const columns = [
    { title: "id", dataIndex: "id", key: "id", hidden: true },
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
    // { title: "phoneId", dataIndex: "phoneId", key: "phoneId", hidden: true },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Nhóm tài khoản",
      dataIndex: "typeGroupAccountString",
      key: "typeGroupAccountString",
    },
    {
      title: "Loại tài khoản",
      dataIndex: "typeAccountDescription",
      key: "typeAccountDescription",
    },
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
            <Space direction="horizontal" size="middle">
              <Select
                options={accountGroupFilter}
                placeholder="Nhóm tài khoản"
                style={{ width: 245 }}
                allowClear
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(value: any) => {
                  if (!value) {
                    setGroupAccountFilter(value)
                    handleSelectChange(value, typeAccountFilter);
                  } else {
                    fetchAccounts(undefined, value);
                  }
                }}
              />
            </Space>
            <div className="w-2" />
            <Space direction="horizontal" size="middle">
              <Select
                options={accountGroupFilter}
                placeholder="Hệ thống"
                style={{ width: 245 }}
                allowClear
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(value: any) => {
                  if (!value) {
                    setTypeAccountFilter(value)
                    handleSelectChange(groupAccountFilter,value);
                  } else {
                    fetchAccounts(undefined, value);
                  }
                }}
              />
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
          <HiddenForm />
          <Form.Item hidden label="id" name="id">
            <Input />
          </Form.Item>
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
              name="groupSystemId"
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
              name="groupBranchId"
              // name="groupBranchId"
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
              className="w-[45%]"
              label="Chọn ngân hàng"
              name="bankId"
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
            <Form.Item label="Lấy giao dịch từ" name="transactionSource">
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
            )}
          </div>
          <Form.Item
            label="Chọn nhóm tài khoản"
            name="selectedAccountGroups"
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
