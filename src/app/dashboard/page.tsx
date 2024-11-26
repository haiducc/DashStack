"use client";

import React, { useEffect, useState } from "react";
import { DatePicker, Select, Space, Spin, Table } from "antd";
import type { TableProps } from "antd/es/table";
import Header from "@/src/component/Header";
import BarChart from "../products/BarChart";
import Statistics from "../products/statistics";
import {
  getListStatistics,
  getTransactionById,
  resendSheet,
} from "@/src/services/statistics";
import BaseModal from "@/src/component/config/BaseModal";
import "./style.css";
import { fetchBankAccounts } from "@/src/services/bankAccount";
import { getListTelegram } from "@/src/services/telegram";
import { useRouter } from "next/navigation";
import { SyncOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";

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
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { RangePicker } = DatePicker;

  const [dataStatistics, setDataStatistics] = useState<DataType[]>([]);
  const [dataTransaction, setDataTransaction] =
    useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<string | null>(null);
  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const formatDate = (inputDate: string | Date): string => {
    const date = new Date(inputDate);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const fetchListStatistics = async (
    bankAccount?: string,
    groupChat?: number,
    transType?: string,
    // transDate?: string | Date[]
    startDate?: string,
    endDate?: string
  ) => {
    const arrFilter: filterProducts[] = [];
    const addedParams = new Set<string>();

    if (bankAccount && !addedParams.has("bankAccountId")) {
      arrFilter.push({
        Name: "bankAccountId",
        Value: bankAccount,
      });
      addedParams.add("bankAccountId");
    }
    if (groupChat && !addedParams.has("groupChatId")) {
      arrFilter.push({
        Name: "groupChatId",
        Value: groupChat.toString(),
      });
      addedParams.add("groupChatId");
    }
    if (transType && !addedParams.has("transType")) {
      arrFilter.push({
        Name: "transType",
        Value: transType,
      });
      addedParams.add("transType");
    }
    if (startDate && endDate) {
      arrFilter.push({
        Name: "startDate",
        Value: formatDate(startDate),
      });
      arrFilter.push({
        Name: "endDate",
        Value: formatDate(endDate),
      });
    }

    arrFilter.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    console.log(localStorage.getItem("key"),1);
    console.log(localStorage.getItem("value"),2);
    setLoading(true);
    try {
      const response = await getListStatistics(1, 20, undefined, arrFilter);
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
    console.log(192,localStorage.getItem("key") )
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
    // {
    //   title: "Số tiền",
    //   dataIndex: "transAmount",
    //   key: "transAmount",
    //   render: (amount: number) => new Intl.NumberFormat("vi-VN").format(amount),
    // },
    {
      title: "Số tiền",
      dataIndex: "transAmount",
      key: "transAmount",
      render: (balance: number, record: { transType: string }) => {
        let sign = "";
        if (record.transType === "2") {
          sign = "-"; // Tiền ra
        } else if (record.transType === "3") {
          sign = "+"; // Tiền vào
        }
        const formattedBalance = Math.abs(balance).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "4px", fontWeight: "bold" }}>
              {sign}
            </span>
            <span>{formattedBalance}</span>
          </div>
        );
      },
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
  const [transTypeFilter, setTransTypeFilter] = useState();
  const [startDateFilter, setTranDateFilter] = useState();

  const options = [
    { value: "3", label: "Tiền vào" },
    { value: "2", label: "Tiền ra" },
    // { value: "1", label: "Cả hai" },
  ];
  // const optionCompany = [
  //   { value: "1", label: "Tài khoản công ty" },
  //   { value: "2", label: "Tài khoản marketing" },
  // ];
  const fetchBankData = async (bankAccount?: string) => {
    const arr: filterProducts[] = [];
    const addedParams = new Set<string>();
    if (bankAccount && !addedParams.has("bankAccount")) {
      arr.push({
        Name: "bankAccount",
        Value: bankAccount,
      });
    }
    arr.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
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
          label:
            x.bank.code + "-" + x.fullName + "-" + x.accountNumber ||
            "Không xác định",
        }));
        // console.log(fetchBankAccountAPI, "fetchBankAccountAPI123");

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
    const addedParams = new Set<string>();
    if (groupChat && !addedParams.has("groupChat")) {
      arr.push({
        Name: "groupChat",
        Value: groupChat,
      });
    }
    arr.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
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
    tranDate?: string;
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

  const handleResendSheet = async (transId: number, sheetMapId: number) => {
    setIsModalOpen(false);
    setIsLoading(true);
    try {
      const response = await resendSheet(transId, sheetMapId);
      if (response.status === 200 && response.success) {
        console.log("API response:", response);
        toast.success("Reload thành công!");
      } else {
        toast.success("Reload thành công!");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("API error:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi gọi API.");
    } finally {
      setIsLoading(false);
    }
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
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <Spin size="large" />
        </div>
      )}
      <div>
        <Header />
        <div className="dashboard mt-7">
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 2 }}>
              <BarChart />
            </div>
            <div style={{ flex: 1 }}>
              <Statistics />
            </div>
          </div>
        </div>
        <div className="flex mx-[35px] mt-7">
          <Space direction="horizontal" size="middle">
            <Select
              mode="multiple"
              options={bankAccountFilter}
              placeholder="Tài khoản ngân hàng"
              style={{ width: 400 }}
              allowClear
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(value: any) => {
                const parsedValue = Array.isArray(value)
                  ? value
                  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value.split(",").map((item: any) => item.trim());
                setBankFilter(value);
                // console.log(value, "value");
                if (!parsedValue.length) {
                  handleSelectChange(
                    parsedValue,
                    chatFilter,
                    transTypeFilter,
                    startDateFilter
                  );
                  setCheckFilter(!checkFilter);
                } else {
                  fetchListStatistics(
                    parsedValue,
                    chatFilter,
                    transTypeFilter,
                    startDateFilter
                  );
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
                  handleSelectChange(
                    bankFilter,
                    value,
                    transTypeFilter,
                    startDateFilter
                  );
                  setCheckFilter(!checkFilter);
                } else {
                  fetchListStatistics(
                    bankFilter,
                    value,
                    transTypeFilter,
                    startDateFilter
                  );
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
                  handleSelectChange(
                    bankFilter,
                    chatFilter,
                    value,
                    startDateFilter
                  );
                  setCheckFilter(!checkFilter);
                } else {
                  fetchListStatistics(
                    bankFilter,
                    chatFilter,
                    value,
                    startDateFilter
                  );
                }
              }}
            />
            {/* <Select
              options={optionCompany}
              placeholder="Loại công ty"
              style={{ width: 245 }}
              allowClear
            /> */}
            <RangePicker
              id={{
                start: "startInput",
                end: "endInput",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(value: any) => {
                setTranDateFilter(value);

                if (!value || value.length !== 2) {
                  handleSelectChange(
                    bankFilter,
                    chatFilter,
                    transTypeFilter,
                    "",
                    ""
                  );
                  setCheckFilter(!checkFilter);
                } else {
                  const [startDate, endDate] = value;
                  handleSelectChange(
                    bankFilter,
                    chatFilter,
                    transTypeFilter,
                    startDate,
                    endDate
                  );
                  fetchListStatistics(
                    bankFilter,
                    chatFilter,
                    transTypeFilter,
                    startDate,
                    endDate
                  );
                }
              }}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />

            {/* <DatePicker
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
                    // endDate
                  );
                }
              }}
            /> */}
            {/* <DatePicker
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
                    // value
                  );
                }
              }}
            /> */}
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
          <div className="font-bold flex py-1 pb-3">
            Ngày giao dịch:
            <div className="pl-2 font-normal">
              {dataTransaction?.transaction?.transDateString}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4">
              <div className="text-xl text-[#495057]">Thông báo Telegram</div>
              <div>
                {dataTransaction?.logChatSqlRes?.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (x: any, index: number) => (
                    <div
                      key={index}
                      className="pt-3 border-b border-solid border-gray-300"
                    >
                      <div>{x?.chatName}</div>
                      <div className="bg-[#04a616] w-24 rounded-xl flex justify-center text-white my-1">
                        {x?.logMessageDescription}
                      </div>
                      <div className="pb-3">
                        {x?.modifiedDate &&
                          new Date(x?.modifiedDate).toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="text-xl text-[#495057]">
                Thông báo Google Sheet
              </div>
              <div>
                {dataTransaction?.logSheetSqlRes?.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (x: any, index: number) => (
                    <div
                      key={index}
                      className="pt-3 border-b border-solid border-gray-300"
                    >
                      <div>{x?.sheetName}</div>
                      <div>
                        {x?.logMessage === "2" ? (
                          <div className="flex justify-between items-center">
                            <div className="bg-[#ff0000] w-12 rounded-xl flex justify-center text-white my-1">
                              {x?.logMessageDescription}
                            </div>
                            <SyncOutlined
                              // spin={isLoading}
                              onClick={() => {
                                handleResendSheet(x.transactionId, x?.id);
                              }}
                              className="cursor-pointer"
                            />
                          </div>
                        ) : (
                          <div className="bg-[#04a616] w-24 rounded-xl flex justify-center text-white my-1">
                            {x?.logMessageDescription}
                          </div>
                        )}
                      </div>
                      <div className="pb-3">
                        {x?.modifiedDate &&
                          new Date(x?.modifiedDate).toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </BaseModal>
    </>
  );
};

export default Dashboard;
