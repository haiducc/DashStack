"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";
import Header from "@/app/component/Header";
import { Button, Form, Input, Select, Space, Table, Radio, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
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
import DeleteModal from "@/app/component/config/modalDelete";

interface filterGroupAccount {
  Name: string;
  Value: string;
}

// interface roleAccount {
//   key: string;
//   Value: number;
// }

const accountTypeOptions = [
  { value: "1", label: "Tài khoản công ty" },
  { value: "2", label: "Tài khoản marketing" },
];

const Account = () => {
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
  const [, setParentId] = useState<number>(0);
  const [value, setValue] = useState("1");
  const [globalTerm, setGlobalTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setIsEditMode] = useState(false);
  const [accountGroup, setAccountGroup] = useState([]);
  //
  const keys = localStorage.getItem("key");
  const values = localStorage.getItem("value");

  // API để lấy ra dsach tài khoản
  const fetchAccounts = async (
    globalTerm?: string,
    searchTerms?: string,
    system?: string,
    branch?: string,
    team?: string
  ) => {
    // console.log(globalTerm, searchTerms, system, branch, team);

    const arrBankAccount: filterGroupAccount[] = [];
    const bankAccount: filterGroupAccount = {
      Name: "groupAccountId",
      Value: searchTerms!,
    };
    const groupSystem: filterGroupAccount = {
      Name: "groupSystemId",
      Value: system!,
    };
    const groupBranch: filterGroupAccount = {
      Name: "groupBranchId",
      Value: branch!,
    };
    const groupTeam: filterGroupAccount = {
      Name: "groupTeamId",
      Value: team!,
    };

    const obj: filterGroupAccount = {
      Name: keys!,
      Value: values!,
    };

    arrBankAccount.push(bankAccount, groupSystem, groupBranch, groupTeam, obj);

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
      const getBranch = await getBranchSystem(pageIndex, pageSize);
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
        // grandparentId,
        // parentId,
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
        toast.error(res.message || "Có lỗi xảy ra, vui lòng thử lại.");
      } else {
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccounts | null>(
    null
  );

  const handleDeleteAccount = async (x: BankAccounts) => {
    setLoading(true);
    try {
      await deleteBankAccount(x.id);
      toast.success("Xóa thành công tài khoản ngân hàng!");
      await fetchAccounts();
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (accountGroup: BankAccounts) => {
    setSelectedAccount(accountGroup);
    setIsDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedAccount(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAccount) {
      handleDeleteAccount(selectedAccount);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    try {
      if (value.trim() === "") {
        const data = await fetchBankAccounts(pageIndex, pageSize);
        const formattedData =
          data?.data?.source?.map((account: BankAccounts) => ({
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
      } else {
        const data = await fetchBankAccounts(pageIndex, pageSize, value);
        const formattedData =
          data?.data?.source?.map((account: BankAccounts) => ({
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
  const [systemFilter, setSystemFilter] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [branchFilter, setBranchFilter] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [TeamFilter, setTeamFilter] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [filterParams, setFilterParams] = useState<{
    groupAccountId?: string;
    groupSystemId?: string;
    groupBranchId?: string;
    groupTeamId?: string;
  }>({});

  const [groupAccountFilter, setGroupAccountFilter] = useState();
  const [groupSystemFilter, setGroupSystemFilter] = useState();
  const [groupBranchFilter, setGroupBranchFilter] = useState();
  const [groupTeamFilter, setGroupTeamFilter] = useState();

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
      // console.log("fetchBankAccountAPI", fetchBankAccountAPI);

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

  const handleSelectChange = (
    groupAccount?: string,
    groupSystem?: string,
    groupBranch?: string,
    groupTeam?: string
  ) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      groupAccountId: groupAccount,
      groupSystemId: groupSystem,
      groupBranchId: groupBranch,
      groupTeamId: groupTeam,
    }));
  };

  const handleFilterSystem = async () => {
    try {
      const { groupSystemId } = filterParams;
      const searchParams = groupSystemId
        ? [{ Name: "groupSystemId", Value: groupSystemId }]
        : [];
      const fetchBankAccountAPI = await getGroupSystem(
        pageIndex,
        pageSize,
        globalTerm,
        searchParams //searchTerms
      );
      // console.log("fetchBankAccountAPI", fetchBankAccountAPI);

      if (
        fetchBankAccountAPI &&
        fetchBankAccountAPI.data &&
        fetchBankAccountAPI.data.source
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = fetchBankAccountAPI.data.source.map((x: any) => ({
          value: x.id,
          label: x.name || "Không xác định",
        }));
        setSystemFilter(res);
      } else {
        setSystemFilter([]);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  const handleFilterBranch = async () => {
    try {
      const { groupBranchId } = filterParams;
      const searchParams = groupBranchId
        ? [{ Name: "groupBranchId", Value: groupBranchId }]
        : [];
      const fetchBankAccountAPI = await getBranchSystem(
        pageIndex,
        pageSize,
        globalTerm,
        searchParams //searchTerms
      );
      // console.log("fetchBankAccountAPI", fetchBankAccountAPI);

      if (
        fetchBankAccountAPI &&
        fetchBankAccountAPI.data &&
        fetchBankAccountAPI.data.source
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = fetchBankAccountAPI.data.source.map((x: any) => ({
          value: x.id,
          label: x.name || "Không xác định",
        }));
        setBranchFilter(res);
      } else {
        setBranchFilter([]);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  const handleFilterTeam = async () => {
    try {
      const { groupTeamId } = filterParams;
      const searchParams = groupTeamId
        ? [{ Name: "groupTeamId", Value: groupTeamId }]
        : [];
      const fetchBankAccountAPI = await getGroupTeam(
        pageIndex,
        pageSize,
        globalTerm,
        searchParams //searchTerms
      );
      // console.log("fetchBankAccountAPI", fetchBankAccountAPI);

      if (
        fetchBankAccountAPI &&
        fetchBankAccountAPI.data &&
        fetchBankAccountAPI.data.source
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = fetchBankAccountAPI.data.source.map((x: any) => ({
          value: x.id,
          label: x.name || "Không xác định",
        }));
        setTeamFilter(res);
      } else {
        setTeamFilter([]);
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
      await handleFilterSystem();
      await handleFilterBranch();
      await handleFilterTeam();
    };

    fetchData();
  }, [filterParams]);

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
    fetchAccounts(
      globalTerm,
      groupAccountFilter,
      groupSystemFilter,
      groupBranchFilter,
      groupTeamFilter
    );
  }, [checkFilter]);

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
                // handleSearch(value);
                setGlobalTerm(value);
                if (!value) {
                  setCheckFilter(!checkFilter);
                }
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
                  setGroupAccountFilter(value);
                  if (!value) {
                    handleSelectChange(
                      value,
                      groupSystemFilter,
                      groupBranchFilter,
                      groupTeamFilter
                    );
                    setCheckFilter(!checkFilter);
                  } else {
                    fetchAccounts(
                      globalTerm,
                      value,
                      groupSystemFilter,
                      groupBranchFilter,
                      groupTeamFilter
                    );
                  }
                }}
              />
            </Space>
            <div className="w-2" />
            <Space direction="horizontal" size="middle">
              <Select
                options={systemFilter}
                placeholder="Hệ thống"
                style={{ width: 245 }}
                allowClear
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(value: any) => {
                  setGroupSystemFilter(value);
                  if (!value) {
                    handleSelectChange(
                      groupAccountFilter,
                      value,
                      groupBranchFilter,
                      groupTeamFilter
                    );
                    setCheckFilter(!checkFilter);
                  } else {
                    fetchAccounts(
                      globalTerm,
                      groupAccountFilter,
                      value,
                      groupBranchFilter,
                      groupTeamFilter
                    );
                  }
                }}
              />
            </Space>
            <div className="w-2" />
            <Space direction="horizontal" size="middle">
              <Select
                options={branchFilter}
                placeholder="Chi nhánh"
                style={{ width: 245 }}
                allowClear
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(value: any) => {
                  setGroupBranchFilter(value);
                  if (!value) {
                    handleSelectChange(
                      groupAccountFilter,
                      groupSystemFilter,
                      value,
                      groupTeamFilter
                    );
                    setCheckFilter(!checkFilter);
                  } else {
                    fetchAccounts(
                      globalTerm,
                      groupAccountFilter,
                      groupSystemFilter,
                      value,
                      groupTeamFilter
                    );
                  }
                }}
              />
            </Space>
            <div className="w-2" />
            <Space direction="horizontal" size="middle">
              <Select
                options={TeamFilter}
                placeholder="Đội nhóm"
                style={{ width: 245 }}
                allowClear
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(value: any) => {
                  setGroupTeamFilter(value);
                  if (!value) {
                    handleSelectChange(
                      groupAccountFilter,
                      groupSystemFilter,
                      groupBranchFilter,
                      value
                    );
                    setCheckFilter(!checkFilter);
                  } else {
                    fetchAccounts(
                      globalTerm,
                      groupAccountFilter,
                      groupSystemFilter,
                      groupBranchFilter,
                      value
                    );
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
          <Spin spinning={loading} />
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
      <DeleteModal
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        selectedAccount={handleDeleteAccount}
      />
    </>
  );
};

export default Account;
