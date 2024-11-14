"use client";

import React, { useEffect, useState } from "react";
import { Select, Space, DatePicker, Table } from "antd";
import type { TableProps } from "antd/es/table";
import Header from "@/app/component/Header";
import BarChart from "../products/BarChart";
import Statistics from "../products/Statistics";
import {
  getListStatistics,
  getTransactionById,
} from "@/app/services/statistics";
import BaseModal from "@/app/component/config/BaseModal";
import "./style.css";
import { fetchBankAccounts } from "@/app/services/bankAccount";
import { getListTelegram } from "@/app/services/telegram";

interface DataType {
  id: number;
  bankName: string;
  bankAccount: number;
  transDateString: Date;
  fullName: string;
  transAmount: number;
  narrative: string;
  transType: string;
  currentBalance: number;
  logStatus: string;
  bankAccountId: number;
}

interface LogEntry {
  chatName?: string;
  sheetName?: string;
  logMessage?: string;
  createdDate: string;
  logMessageDescription: string;
}

interface Transaction {
  id: number;
  bankAccountId: number;
  groupChatId: number;
  transDate: string;
  transAmount: number;
  fullName: string;
  narrative: string;
  balanceBeforeTrans: number;
  currentBalance: number;
  transType: string;
  transDateString: string;
  logMessageDescription: string;
  transTypeDescription: string;
}

interface TransactionData {
  logChatSqlRes: LogEntry[];
  logSheetSqlRes: LogEntry[];
  transaction: Transaction;
}

interface filterProducts {
  Name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Value: any;
}

const Dashboard = () => {
  // const [, setSelectedOptions] = useState({
  //   accountType: "",
  //   transactionType: "",
  //   accountGroup: "",
  // });
  // const { RangePicker } = DatePicker;
  const [dataStatistics, setDataStatistics] = useState<DataType[]>([]);
  const [dataTransaction, setDataTransaction] =
    useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState<string | null>(null);
  const [values, setValues] = useState<string | null>(null);
  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchListStatistics = async (
    bankAccount?: string,
    groupChat?: number,
    transType?: string,
    // date?: string
    startDate?: string,
    endDate?: string
  ) => {
    const arrFilter: filterProducts[] = [];
    const bank: filterProducts = {
      Name: "bankAccountId",
      Value: bankAccount!,
    };
    const chat: filterProducts = {
      Name: "groupChatId",
      Value: groupChat!,
    };
    const type: filterProducts = {
      Name: "transType",
      Value: transType!,
    };
    const start: filterProducts = {
      Name: "startDate",
      Value: startDate!,
    };
    const end: filterProducts = {
      Name: "endDate",
      Value: endDate!,
    };
    const obj: filterProducts = {
      Name: keys!,
      Value: values!,
    };

    arrFilter.push(bank, obj, chat, type, start, end);
    // console.log(bankAccount, "bankAccount");
    setLoading(true);
    try {
      const response = await getListStatistics(1, 20, arrFilter);
      console.log(response);

      const formattedData =
        response?.data?.source?.map((x: DataType) => ({
          id: x.id,
          bankName: x.bankName,
          bankAccount: x.bankAccount,
          transDateString: x.transDateString,
          fullName: x.fullName,
          transAmount: x.transAmount,
          narrative: x.narrative,
          transType: x.transType,
          currentBalance: x.currentBalance,
          logStatus: x.logStatus,
          bankAccountId: x.bankAccountId,
        })) || [];
      setDataStatistics(formattedData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchListStatistics();
  }, [keys]);

  const fetchStatisticsById = async (id: number) => {
    try {
      const response = await getTransactionById(id);
      console.log("Transaction data:", response?.data);
      setDataTransaction(response?.data);
    } catch (error) {
      console.error("Error fetching transaction by id:", error);
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    { title: "Id", dataIndex: "id", key: "id" },
    { title: "Ngân hàng", dataIndex: "bankName", key: "bankName" },
    { title: "TK ngân hàng", dataIndex: "bankAccount", key: "bankAccount" },
    {
      title: "Ngày giao dịch",
      dataIndex: "transDateString",
      key: "transDateString",
    },
    {
      title: "Chủ tài khoản",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số tiền",
      dataIndex: "transAmount",
      key: "transAmount",
      render: (amount: number) => new Intl.NumberFormat("vi-VN").format(amount),
    },
    { title: "Nội dung CK", dataIndex: "narrative", key: "narrative" },
    {
      title: "Loại giao dịch",
      dataIndex: "transType",
      key: "transType",
      render: (type: string) => {
        const className = type === "3" ? "text-green-500" : "text-red-500";
        const label = type === "3" ? "Tiền vào" : "Tiền ra";

        return <div className={`font-bold ${className}`}>{label}</div>;
      },
    },
    {
      title: "Số dư",
      dataIndex: "currentBalance",
      key: "currentBalance",
      render: (balance: number) =>
        new Intl.NumberFormat("vi-VN").format(balance),
    },
    {
      title: "Trạng thái",
      dataIndex: "logStatus",
      key: "logStatus",
      render: (status: string, record: DataType) => (
        <div
          className={`text-white flex items-center justify-center rounded-md font-bold w-[93px] h-[27px] cursor-pointer ${
            status === "1" ? "bg-green-500" : "bg-red-500"
          }`}
          onClick={() => {
            fetchStatisticsById(record.id);
            showModal();
          }}
        >
          {status === "1" ? "Thành công" : "Giao dịch lỗi"}
        </div>
      ),
    },
  ];

  // const options = [
  //   // { key: "accountType", value: "company", label: "Tài khoản công ty" },
  //   { key: "accountType", value: "bank", label: "Tài khoản ngân hàng" },
  //   { key: "accountGroup", value: "telegram", label: "Nhóm chat Telegram" },
  //   { key: "transactionType", value: "transaction", label: "Loại giao dịch" },
  //   { key: "accountGroup", value: "accountGroup", label: "Nhóm tài khoản" },
  // ];

  // const handleChange = (key: string, value: string) => {
  //   setSelectedOptions((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  const [bankFilter, setBankFilter] = useState();
  const [chatFilter, setChatFilter] = useState();

  const [bankAccountFilter, setBankAccountFilter] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [groupChatFilter, setGroupChatFilter] = useState<
    Array<{ value: string; label: string }>
  >([]);
  // const [transTypeFilter, setTransTypeFilter] = useState<
  //   Array<{ value: string; label: string }>
  // >([]);
  const [transTypeFilter, setTransTypeFilter] = useState();
  // const [date, setDate] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const options = [
    { value: "3", label: "Tiền vào" },
    { value: "2", label: "Tiền ra" },
    { value: "1", label: "Cả hai" },
  ];
  const optionCompany = [
    { value: "1", label: "Tài khoản công ty" },
    { value: "2", label: "Tài khoản marketing" },
  ];
  const fetchBankData = async (bankAccount?: string) => {
    const arr: filterProducts[] = [];
    const groupChatFilter: filterProducts = {
      Name: "bankAccountId",
      Value: bankAccount!,
    };
    const obj: filterProducts = {
      Name: keys!,
      Value: values!,
    };
    arr.push(obj, groupChatFilter);
    try {
      const fetchBankAccountAPI = await fetchBankAccounts(
        pageIndex,
        pageSize,
        undefined,
        arr
      );

      if (
        fetchBankAccountAPI &&
        fetchBankAccountAPI.data &&
        fetchBankAccountAPI.data.source
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = fetchBankAccountAPI.data.source.map((x: any) => ({
          value: x.id,
          label: x.fullName + "-" + x.accountNumber || "Không xác định",
        }));
        // console.log(fetchBankAccountAPI, "fetchBankAccountAPI");

        setBankAccountFilter(res);
      } else {
        setBankAccountFilter([]);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  const fetchListTelegram = async (groupChat?: string) => {
    const arr: filterProducts[] = [];
    const groupChatFilter: filterProducts = {
      Name: "groupChatId",
      Value: groupChat!,
    };
    const obj: filterProducts = {
      Name: keys!,
      Value: values!,
    };
    arr.push(obj, groupChatFilter);
    try {
      const fetchBankAccountAPI = await getListTelegram(
        pageIndex,
        pageSize,
        undefined,
        arr
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
        // console.log(fetchBankAccountAPI, "fetchBankAccountAPI");

        setGroupChatFilter(res);
      } else {
        setGroupChatFilter([]);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  const [filterParams, setFilterParams] = useState<{
    bankAccountId?: string;
    groupChatId?: number;
    transType?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const handleSelectChange = (
    bankAccount?: string,
    groupChat?: number,
    transType?: string,
    startDate?: string,
    endDate?: string
  ) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      bankAccountId: bankAccount,
      groupChatId: groupChat,
      transType: transType,
      startDate: startDate,
      endDate: endDate,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchBankData();
      await fetchListTelegram();
    };

    fetchData();
  }, [filterParams]);

  const [checkFilter, setCheckFilter] = useState(false);
  useEffect(() => {
    fetchListStatistics(bankFilter, chatFilter);
  }, [checkFilter]);

  return (
    <>
      <div>
        <Header />
        <div className="dashboard mt-7">
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 3 }}>
              <BarChart />
            </div>
            <div style={{ flex: 1 }}>
              <Statistics />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-7">
          <Space direction="horizontal" size="middle">
            <Select
              options={bankAccountFilter}
              placeholder="Tài khoản ngân hàng"
              style={{ width: 245 }}
              allowClear
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(value: any) => {
                setBankFilter(value);
                // console.log(value, "value");

                if (!value) {
                  handleSelectChange(value, chatFilter, transTypeFilter);
                  setCheckFilter(!checkFilter);
                } else {
                  fetchListStatistics(value, chatFilter, transTypeFilter);
                }
              }}
            />
            <Select
              options={groupChatFilter}
              placeholder="Nhóm chat telegram"
              style={{ width: 245 }}
              allowClear
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(value: any) => {
                setChatFilter(value);
                // console.log(value, "value");

                if (!value) {
                  handleSelectChange(bankFilter, value, transTypeFilter);
                  setCheckFilter(!checkFilter);
                } else {
                  fetchListStatistics(bankFilter, value, transTypeFilter);
                }
              }}
            />
            <Select
              options={options}
              placeholder="Loại giao dịch"
              style={{ width: 245 }}
              allowClear
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(value: any) => {
                console.log(value, "value");
                setTransTypeFilter(value);
                if (!value) {
                  handleSelectChange(bankFilter, chatFilter, value);
                  setCheckFilter(!checkFilter);
                } else {
                  fetchListStatistics(bankFilter, chatFilter, value);
                }
              }}
            />
            <Select
              options={optionCompany}
              placeholder="Loại công ty"
              style={{ width: 245 }}
              allowClear
            />
            <DatePicker 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(value: any) => {
                setStartDate(value);
                if (!value) {
                  handleSelectChange(
                    bankFilter,
                    chatFilter,
                    transTypeFilter,
                    value,
                    endDate
                  );
                  setCheckFilter(!checkFilter);
                } else {
                  fetchListStatistics(
                    bankFilter,
                    chatFilter,
                    transTypeFilter,
                    value,
                    endDate
                  );
                }
              }}
            />
            <DatePicker 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(value: any) => {
                setEndDate(value);
                if (!value) {
                  handleSelectChange(
                    bankFilter,
                    chatFilter,
                    transTypeFilter,
                    startDate,
                    value
                  );
                  setCheckFilter(!checkFilter);
                } else {
                  fetchListStatistics(
                    bankFilter,
                    chatFilter,
                    transTypeFilter,
                    startDate,
                    value
                  );
                }
              }}
            />
          </Space>
        </div>
        <div className="mt-5 mx-[35px]">
          <Table<DataType>
            columns={columns}
            dataSource={dataStatistics}
            loading={loading}
          />
        </div>
      </div>
      <BaseModal
        title="Chi tiết giao dịch"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        offPadding
      >
        <div className="w-full">
          <div className="text-red-500 text-2xl pb-2">
            -{" "}
            {new Intl.NumberFormat("vi-VN", {
              currency: "VND",
            }).format(dataTransaction?.transaction?.transAmount || 0)}
          </div>
          <div className="font-bold flex py-1">
            Tài khoản:{" "}
            <div className="font-normal pl-1">
              {dataTransaction?.transaction?.fullName}
            </div>
          </div>
          <div className="font-bold flex py-1">
            Nội dung:{" "}
            <div className="pl-2 font-normal">
              {dataTransaction?.transaction?.narrative}
            </div>
          </div>
          <div className="font-bold flex py-1">
            Số dư:
            <div className="pl-2 font-normal">
              {new Intl.NumberFormat("vi-VN", {
                currency: "VND",
              }).format(dataTransaction?.transaction?.currentBalance || 0)}
            </div>
          </div>
          <div className="font-bold flex py-1">
            Trạng thái:
            <div className="pl-2 font-normal">
              {dataTransaction?.transaction?.logMessageDescription}
            </div>
          </div>
          <div className="font-bold flex py-1">
            Ngày giao dịch:
            <div className="pl-2 font-normal">
              {dataTransaction?.transaction?.transDateString}
            </div>
          </div>
        </div>
      </BaseModal>
    </>
  );
};

export default Dashboard;
