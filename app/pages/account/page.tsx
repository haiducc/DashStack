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
  const [selectedAccountType, setSelectedAccountType] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAccountTypeChange = (value: any) => {
    setSelectedAccountType(value);
  };
  const [dataAccount, setDataAccount] = useState<BankAccounts[]>([]);
  const [banks, setBanks] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [groupSystem, setGroupSystem] = useState([]);
  const [branchSystem, setBranchSystem] = useState([]);
  const [groupTeam, setGroupTeam] = useState<Array<BankAccounts>>([]);
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);
  const [value, setValue] = useState("");
  const [globalTerm, setGlobalTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setIsEditMode] = useState(false);
  const [accountGroup, setAccountGroup] = useState([]);
  //
  const [keys, setKeys] = useState<string | null>(null);
  const [values, setValues] = useState<string | null>(null);

  const [groupSystemName, setGroupSystemName] = useState<string | null>(null);
  const [groupBranchName, setGroupBranchName] = useState<string | null>(null);
  const [groupTeamName, setGroupTeamName] = useState<string | null>(null);

  const [groupSystemId, setGroupSystemId] = useState<string | null>(null);
  const [groupBranchId, setGroupBranchId] = useState<string | null>(null);
  const [groupTeamId, setGroupTeamId] = useState<string | null>(null);

  const [defaultGroupSystemId, setDefaultGroupSystemId] = useState<
    string | null
  >(null);
  const [defaultGroupBranchId, setDefaultGroupBranchId] = useState<
    string | null
  >(null);
  const [defaultGroupTeamId, setDefaultGroupTeamId] = useState<string | null>(
    null
  );

  const [defaultGroupSystemName, setDefaultGroupSystemName] = useState<
    string | null
  >(null);
  const [defaultGroupBranchName, setDefaultGroupBranchName] = useState<
    string | null
  >(null);
  const [defaultGroupTeamName, setDefaultGroupTeamName] = useState<
    string | null
  >(null);

  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));

    setGroupSystemName(localStorage.getItem("groupSystemName"));
    setGroupBranchName(localStorage.getItem("groupBranchName"));
    setGroupTeamName(localStorage.getItem("groupTeamName"));

    setDefaultGroupSystemName(localStorage.getItem("groupSystemName"));
    setDefaultGroupBranchName(localStorage.getItem("groupBranchName"));
    setDefaultGroupTeamName(localStorage.getItem("groupTeamName"));

    setGroupSystemId(localStorage.getItem("groupSystemId"));
    setGroupBranchId(localStorage.getItem("groupBranchId"));
    setGroupTeamId(localStorage.getItem("groupTeamId"));

    setDefaultGroupSystemId(localStorage.getItem("groupSystemId"));
    setDefaultGroupBranchId(localStorage.getItem("groupBranchId"));
    setDefaultGroupTeamId(localStorage.getItem("groupTeamId"));

    handleDataDefault();
  }, []);

  // API để lấy ra dsach tài khoản
  const fetchAccounts = async (
    globalTerm?: string,
    searchTerms?: string,
    system?: string,
    branch?: string,
    team?: string
  ) => {
    const arrBankAccount: filterGroupAccount[] = [];
    const addedParams = new Set();
    if (Array.isArray(searchTerms)) {
      searchTerms.forEach((term) => {
        if (term.Value && !addedParams.has(term.Name)) {
          arrBankAccount.push({
            Name: term.Name,
            Value: term.Value,
          });
          addedParams.add(term.Name);
        }
      });
    } else if (searchTerms) {
      if (!addedParams.has("groupAccountId")) {
        // console.log(96);

        arrBankAccount.push({
          Name: "groupAccountId",
          Value: searchTerms,
        });
        addedParams.add("groupAccountId");
      }
    }
    if (system && !addedParams.has("groupSystemId")) {
      arrBankAccount.push({
        Name: "groupSystemId",
        Value: system,
      });
      addedParams.add("groupSystemId");
    }
    if (branch && !addedParams.has("groupBranchId")) {
      arrBankAccount.push({
        Name: "groupBranchId",
        Value: branch,
      });
      addedParams.add("groupBranchId");
    }
    if (team && !addedParams.has("groupTeamId")) {
      arrBankAccount.push({
        Name: "groupTeamId",
        Value: team,
      });
      addedParams.add("groupTeamId");
    }
    // if (keys && values && !addedParams.has(keys)) {
    // console.log(keys, values, !addedParams.has(keys));
    arrBankAccount.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys);
    // }
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

  // useEffect(() => {
  //   fetchAccounts();
  // }, [keys]);

  const fetchBankData = async () => {
    try {
      const bankData = await getBank(pageIndex, pageSize);
      const formattedBanks =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bankData?.data?.source?.map((bank: any) => ({
          value: bank.id,
          label: bank.code + " - " + bank.fullName || "Không xác định",
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
    const arrAccountGroup: filterGroupAccount[] = [];
    const addedParams = new Set<string>();
    arrAccountGroup.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    try {
      const accountGroup = await getAccountGroup(
        pageIndex,
        pageSize,
        globalTerm
        // arrAccountGroup
      );
      console.log("accountGroup", accountGroup);

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

  // const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([]);

  const getGroupSystems = async () => {
    const arrAccountGroup: filterGroupAccount[] = [];
    const addedParams = new Set<string>();
    arrAccountGroup.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);

    try {
      const getSystem = await getGroupSystem(
        pageIndex,
        pageSize,
        globalTerm,
        arrAccountGroup
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = getSystem?.data?.source?.map((x: any) => ({
        value: x.id,
        label: x.name || "Không xác định",
      }));
      setGroupSystem(res);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // const systemIds = getSystem?.data?.source?.map((x: any) => x.id) || [];
      // setSelectedSystemIds(systemIds);
    } catch (error) {
      console.error(error);
    }
  };

  const getBranchSystems = async () => {
    const arrAccountGroup: filterGroupAccount[] = [];
    const addedParams = new Set<string>();
    arrAccountGroup.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    try {
      const getBranch = await getBranchSystem(
        pageIndex,
        pageSize,
        globalTerm,
        arrAccountGroup
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = getBranch?.data?.source?.map((x: any) => ({
        value: x.id,
        label: x.name || "Không xác định",
      }));
      // const res = getBranch?.data?.source
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   ?.filter((x: any) => selectedSystemIds.includes(x.systemId))
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   .map((x: any) => ({
      //     value: x.id,
      //     label: x.name || "Không xác định",
      //   }));
      setBranchSystem(res);
    } catch (error) {
      console.error(error);
    }
  };

  const getGroupTeams = async () => {
    const arrAccountGroup: filterGroupAccount[] = [];
    const addedParams = new Set<string>();
    arrAccountGroup.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    try {
      const groupTeams = await getGroupTeam(
        pageIndex,
        pageSize,
        globalTerm,
        arrAccountGroup
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

  const defaultModalAdd = () => {
    form.setFieldsValue({
      groupSystemId: defaultGroupSystemId,
      groupBranchId: defaultGroupBranchId,
      groupTeamId: defaultGroupTeamId,
      groupSystemName: defaultGroupSystemName,
      groupBranchName: defaultGroupBranchName,
      groupTeamName: defaultGroupTeamName,
    });
  };

  const handleAddConfirm = async () => {
    try {
      await form.validateFields();
      const formData = await form.getFieldsValue();
      setLoading(true);
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
        groupSystemId: Number(saveGroupSystem),
        groupBranchId: Number(saveGroupBranch),
        groupTeamId: Number(saveGroupTeam),
        bankId: Number(saveBank),
        groupSystem: formData.groupSystem,
        groupBranch: formData.groupBranch,
        groupTeam: formData.groupTeam,
      });
      if (!res || !res.success) {
        toast.error(res?.message || "Có lỗi xảy ra, vui lòng thử lại.");
      } else {
        setAddModalOpen(false);
        form.resetFields();
        setCurrentAccount(null);
        await fetchAccounts();
        toast.success("Thêm mới thành công!");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const responseData = axiosError.response.data as {
          success: boolean;
          message: string;
          code: number;
          errors?: string[];
          errorFields?: Array<{
            name: string[];
            errors: string[];
          }>;
        };
        if (responseData.code === 400 && responseData.errorFields) {
          responseData.errorFields.forEach((field) => {
            field.errors.forEach((err) => {
              toast.error(`Lỗi ở trường ${field.name.join(", ")}: ${err}`);
            });
          });
        } else if (responseData.code === 500) {
          toast.error(responseData.message || "Lỗi server, vui lòng thử lại.");
        } else {
          toast.error(
            responseData.message || "Có lỗi xảy ra, vui lòng thử lại."
          );
        }
      } else {
        toast.error("Vui lòng nhập tất cả các trường bắt buộc để thêm mới!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccount = (account: BankAccounts) => {
    setIsEditMode(true);
    setCurrentAccount(account);
    const type = account.typeAccount;
    const phone = account.transactionSource;
    setSelectedAccountType(type!);
    setValue(phone!);

    const initGroupSystemId = account.groupSystemId
      ? account.groupSystemId.toString()
      : defaultGroupSystemId;
    setSaveGroupSystem(initGroupSystemId!);

    const initGroupBranchId = account.groupBranchId
      ? account.groupBranchId.toString()
      : defaultGroupBranchId;
    setSaveGroupBranch(initGroupBranchId!);

    const initGroupTeamId = account.groupTeamId
      ? account.groupTeamId.toString()
      : defaultGroupTeamId;
    setSaveGroupTeam(initGroupTeamId!);

    const initBankId = account.bankId?.toString();
    setSaveBank(initBankId!);

    // console.log();

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
  // useEffect(() => {
  //   fetchAccounts();
  // }, []);

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
  const handleFilter = async (searchTerms?: string) => {
    const arrAccountGroup: filterGroupAccount[] = [];
    const groupAccount: filterGroupAccount = {
      Name: "groupAccountId",
      Value: searchTerms!,
    };
    const obj: filterGroupAccount = {
      Name: keys!,
      Value: values!,
    };
    arrAccountGroup.push(obj, groupAccount);
    try {
      const fetchBankAccountAPI = await getAccountGroup(
        pageIndex,
        pageSize,
        globalTerm,
        arrAccountGroup
      );
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
    setFilterParams((prevParams) => {
      if (
        prevParams.groupAccountId !== groupAccount ||
        prevParams.groupSystemId !== groupSystem ||
        prevParams.groupBranchId !== groupBranch ||
        prevParams.groupTeamId !== groupTeam
      ) {
        return {
          ...prevParams,
          groupAccountId: groupAccount,
          groupSystemId: groupSystem,
          groupBranchId: groupBranch,
          groupTeamId: groupTeam,
        };
      }
      return prevParams;
    });
  };

  const handleDataDefault = async () => {
    const arrData = [];
    arrData.push({
      label: localStorage.getItem("groupSystemName")!,
      value: localStorage.getItem("groupSystemId")!,
    });

    const arrDataBranch = [];
    arrDataBranch.push({
      label: localStorage.getItem("groupBranchName")!,
      value: localStorage.getItem("groupBranchId")!,
    });

    const arrDataTeam = [];
    arrDataTeam.push({
      label: localStorage.getItem("groupTeamName")!,
      value: localStorage.getItem("groupTeamId")!,
    });

    setSystemFilter(arrData);
    setBranchFilter(arrDataBranch);
    setTeamFilter(arrDataTeam);
  };

  const handleFilterSystem = async (groupSystemId?: string) => {
    const arrAccountGroup: filterGroupAccount[] = [];
    arrAccountGroup.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    if (groupSystemId) {
      arrAccountGroup.push({ Name: "groupSystemId", Value: groupSystemId });
    }
    try {
      const fetchBankAccountAPI = await getGroupSystem(
        pageIndex,
        pageSize,
        globalTerm,
        arrAccountGroup
      );

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

  const handleFilterBranch = async (groupBranchId?: string) => {
    const arr: filterGroupAccount[] = [];
    const branch: filterGroupAccount = {
      Name: "groupBranchId",
      Value: groupBranchId!,
    };
    const obj: filterGroupAccount = {
      Name: keys!,
      Value: values!,
    };
    arr.push(obj, branch);
    try {
      const fetchBankAccountAPI = await getBranchSystem(
        pageIndex,
        pageSize,
        globalTerm,
        arr //searchTerms
      );
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

  const handleFilterTeam = async (groupTeamId?: string) => {
    const arr: filterGroupAccount[] = [];
    const system: filterGroupAccount = {
      Name: "groupSystemId",
      Value: groupSystemId!,
    };
    const team: filterGroupAccount = {
      Name: "groupTeamId",
      Value: groupTeamId!,
    };
    const obj: filterGroupAccount = {
      Name: keys!,
      Value: values!,
    };
    arr.push(obj, team, system);
    try {
      const fetchBankAccountAPI = await getGroupTeam(
        pageIndex,
        pageSize,
        globalTerm,
        arr //searchTerms
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
    const fetchData = async () => {
      await handleFilter();
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
            onClick={() => {
              handleEditAccount(record);
              // defaultModalAdd();
            }}
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
  const [saveGroupSystem, setSaveGroupSystem] = useState("");
  const [saveGroupBranch, setSaveGroupBranch] = useState("");
  const [saveGroupTeam, setSaveGroupTeam] = useState("");
  const [saveBank, setSaveBank] = useState("");
  // const [typeAccountValue, setTypeAccountValue] = useState()

  useEffect(() => {
    // console.log(1);
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
              {groupSystemName && (
                <Select
                  disabled={defaultGroupSystemId ? true : false}
                  defaultValue={
                    groupSystemId?.trim()
                      ? {
                          value: groupSystemId,
                          label: groupSystemName,
                        }
                      : undefined
                  }
                  onFocus={() => handleFilterSystem()}
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
              )}
            </Space>
            <div className="w-2" />
            <Space direction="horizontal" size="middle">
              {groupBranchName && (
                <Select
                  disabled={defaultGroupBranchId ? true : false}
                  defaultValue={
                    groupBranchId?.trim()
                      ? {
                          value: groupBranchId,
                          label: groupBranchName,
                        }
                      : undefined
                  }
                  onFocus={() => handleFilterBranch()}
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
                      // setCheckFilter((prev) => !prev);
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
              )}
            </Space>
            <div className="w-2" />
            <Space direction="horizontal" size="middle">
              {groupTeamName && (
                <Select
                  disabled={defaultGroupTeamId ? true : false}
                  defaultValue={
                    groupTeamId?.trim()
                      ? {
                          value: groupTeamId,
                          label: groupTeamName,
                        }
                      : undefined
                  }
                  onFocus={() => handleFilterTeam()}
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
              )}
            </Space>
          </div>
          <Button
            className="bg-[#4B5CB8] w-[136px] h-[40px] text-white font-medium hover:bg-[#3A4A9D]"
            onClick={() => {
              setCurrentAccount(null);
              form.resetFields();
              setAddModalOpen(true);
              defaultModalAdd();
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
              onChange={(e) => {
                // console.log(e);
                handleAccountTypeChange(e);
              }}
            />
          </Form.Item>
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Chọn hệ thống"
              name="groupSystemName"
              rules={[{ required: true, message: "Vui lòng chọn hệ thống!" }]}
            >
              <Select
                disabled={defaultGroupSystemId ? true : false}
                defaultValue={
                  form.getFieldsValue().groupSystemId?.toString().trim()
                    ? {
                        value: form.getFieldsValue().groupSystemId,
                        label: form.getFieldsValue().groupSystemName,
                      }
                    : undefined
                }
                onFocus={() => getGroupSystems()}
                placeholder="Chọn hệ thống"
                options={groupSystem}
                onChange={(e) => {
                  console.log(e);
                  const id = Number(e).toString();
                  setSaveGroupSystem(id);
                  getBranchSystems();
                }}
              />
            </Form.Item>
            <Form.Item
              hidden
              className="w-[45%]"
              label="Chọn hệ thống"
              name="groupSystemId"
            >
              <Select />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Chọn chi nhánh"
              name="groupBranchName"
            >
              <Select
                disabled={defaultGroupBranchId ? true : false}
                defaultValue={
                  form.getFieldsValue().groupBranchId?.toString().trim()
                    ? {
                        value: form.getFieldsValue().groupBranchId,
                        label: form.getFieldsValue().groupBranchName,
                      }
                    : undefined
                }
                onFocus={() => getBranchSystems()}
                placeholder="Chọn chi nhánh"
                options={branchSystem}
                onChange={(e) => {
                  console.log(e);

                  const id = Number(e).toString();
                  setGroupBranchId(id);
                  // setParentId(value);
                  getGroupTeams();
                  setSaveGroupBranch(id);
                }}
              />
            </Form.Item>
            <Form.Item
              hidden
              className="w-[45%]"
              label="Chọn chi nhánh"
              name="groupBranchId"
            >
              <Select />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            {selectedAccountType === "2" && (
              <>
                <Form.Item
                  className="w-[45%]"
                  label="Chọn đội nhóm"
                  name="groupTeamName"
                >
                  <Select
                    disabled={defaultGroupTeamId ? true : false}
                    defaultValue={
                      form.getFieldsValue().groupTeamId?.toString().trim()
                        ? {
                            value: form.getFieldsValue().groupTeamId,
                            label: form.getFieldsValue().groupTeamName,
                          }
                        : undefined
                    }
                    onFocus={() => getGroupTeams()}
                    placeholder="Chọn đội nhóm"
                    // onFocus={getGroupTeams}
                    options={groupTeam}
                    onChange={async (e) => {
                      console.log(e);
                      const id = Number(e).toString();
                      setSaveGroupTeam(id);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  hidden
                  className="w-[45%]"
                  label="Chọn đội nhóm"
                  name="groupTeamId"
                >
                  <Select />
                </Form.Item>
              </>
            )}
          </div>
          <Form.Item
            className="w-full"
            label="Chọn ngân hàng"
            name="bankName"
            rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
          >
            <Select
              allowClear
              defaultValue={
                form.getFieldsValue().bankId?.toString().trim()
                  ? {
                      value: form.getFieldsValue().bankId,
                      label: form.getFieldsValue().bankName,
                    }
                  : undefined
              }
              onFocus={() => fetchBankData()}
              placeholder="Chọn ngân hàng"
              options={banks}
              onChange={async (e) => {
                console.log(e);
                const id = Number(e).toString();
                setSaveBank(id);
              }}
            />
          </Form.Item>
          <Form.Item
            hidden
            className="w-[45%]"
            label="Chọn ngân hàng hidden"
            name="bankId"
          >
            <Select />
          </Form.Item>
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
                // defaultValue={"1"}
                value={value}
              >
                <Space direction="vertical">
                  <Radio value={"2"}>Giao dịch từ SMS</Radio>
                  <Radio value={"1"}>Giao dịch từ Email</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            {value === "2" && (
              <Form.Item
                className="w-[45%]"
                label="Nhập số điện thoại"
                name="phoneId"
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
              onChange={(e) => {
                console.log(e);
              }}
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
              onClick={() => {
                handleAddConfirm();
                // defaultModalAdd()
              }}
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
