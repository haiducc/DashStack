"use client";

import React, { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import Header from "@/src/component/Header";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import {
  addTransaction,
  deleteTransaction,
  getTransaction,
} from "@/src/services/transaction";
import BaseModal from "@/src/component/config/BaseModal";
import { fetchBankAccounts, getBank } from "@/src/services/bankAccount";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import DeleteModal from "@/src/component/config/modalDelete";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";

export interface TransactionModal {
  id: number;
  bankName: string;
  bankAccountId: number;
  bankAccount: string;
  fullName: string;
  transDateString: string;
  transType: string;
  purposeDescription: string;
  reason: string;
  balanceBeforeTrans: number;
  currentBalance: number;
  notes: string;
  transDate?: string;
  bankId?: number;
  feeIncurred: number;
  transAmount: number;
}

interface filterRole {
  Name: string;
  Value: string;
}

const Transaction = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataTransaction, setDataTransaction] = useState<TransactionModal[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [globalTerm, setGlobalTerm] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] =
    useState<TransactionModal | null>(null);
  const [banks, setBanks] = useState<Array<TransactionModal>>([]);
  const [bankAccount, setBankAccount] = useState<Array<TransactionModal>>([]);
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  const [keys, setKeys] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<string | null>(null);
  const [isAddTransaction, setIsAddTransaction] = useState<boolean>(false);

  // const initialDate = dataTransaction?.transDate
  //   ? dayjs(dataTransaction.transDate)
  //   : null;
  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchTransaction = async (
    globalTerm?: string
    // searchTerms?: string
  ) => {
    const arrRole: filterRole[] = [];
    const addedParams = new Set<string>();
    arrRole.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    setLoading(true);
    try {
      const response = await getTransaction(
        pageIndex,
        pageSize,
        globalTerm,
        arrRole
      );
      console.log(response, "transaction");
      const formattedData =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response?.data?.source?.map((item: any) => ({
          id: item.id, // id
          bankName: item.bankName, // Mã ngân hàng
          bankAccount: item.bankAccount, // stk
          fullName: item.fullName, // tên chủ tk
          transDateString: item.transDateString || new Date(), // Ngày giao dịch
          transType: item.transType, // Giao dịch
          purposeDescription: item.purposeDescription, // Mục đích
          reason: item.reason, // lý do
          balanceBeforeTrans: item.balanceBeforeTrans, // Số dư trc giao dịch
          currentBalance: item.currentBalance, // số dư hiện tại
          notes: item.notes, // ghi chú
          bankAccountId: item.bankAccountId, // thêm trường id tài khoản
          feeIncurred: item.feeIncurred,
          transAmount: item.transAmount,
          transDate: item.transDate
            ? dayjs(item.transDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
            : null,
          // transDate: item.transDate,
        })) || [];
      setDataTransaction(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankData = async () => {
    try {
      const bankData = await getBank(pageIndex, pageSize);
      const formattedBanks =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bankData?.data?.source?.map((bank: any) => ({
          value: bank.code,
          label: bank.code + " - " + bank.fullName,
          bankId: bank.id,
        })) || [];
      setBanks(formattedBanks);
      console.log(formattedBanks, "formattedBanks");
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const genBankAccountData = async (bankId?: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = {
      Name: "bankId",
      Value: bankId,
    };
    await arr.push(obj);
    try {
      const bankData = await fetchBankAccounts(1, 50, undefined, arr);
      // console.log(bankData, "bankData");
      const formattedBanks =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bankData?.data?.source?.map((bankAccount: any) => ({
          value: bankAccount.id,
          label: `${bankAccount.accountNumber} - ${bankAccount.fullName}`,
          bankAccountId: bankAccount.id,
        })) || [];
      setBankAccount(formattedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const handleAddConfirm = async (isAddTransaction: boolean) => {
    // const formData = form.getFieldsValue();
    const formData = await form.validateFields();
    setLoading(true);
    // console.log(formData, "formData");
    try {
      await form.validateFields();
      setIsAddTransaction(isAddTransaction);
      setAddModalOpen(false);
      if (currentTransaction) {
        const response = await addTransaction({
          id: currentTransaction.id,
          bankName: formData.bankName,
          bankAccountId: formData.bankAccountId,
          fullName: formData.fullName,
          transDateString: formData.transDateString,
          transType: formData.transType,
          purposeDescription: formData.purposeDescription,
          reason: formData.reason,
          balanceBeforeTrans: formData.balanceBeforeTrans,
          currentBalance: formData.currentBalance,
          notes: formData.notes,
          transAmount: formData.transAmount,
          // transDate: selectedDate,
          transDate: selectedDate
            ? dayjs(selectedDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
            : undefined,
          bankId: selectBankId,
          feeIncurred: formData.feeIncurred,
          bankAccount: "",
        });
        if (response && response.success === false) {
          toast.error(response.message || "Cập nhật giao dịch lỗi.");
          setLoading(false);
          setIsAddTransaction(false);
          return;
        }
        console.log("Dữ liệu đã được cập nhật:", response);
        toast.success("Cập nhật giao dịch thành công!");
      } else {
        const response = await addTransaction({
          id: formData.id,
          bankName: formData.bankName,
          bankAccountId: formData.bankAccountId,
          fullName: formData.fullName,
          transDateString: formData.transDateString,
          transType: formData.transType,
          purposeDescription: formData.purposeDescription,
          reason: formData.reason,
          balanceBeforeTrans: formData.balanceBeforeTrans,
          currentBalance: formData.currentBalance,
          notes: formData.notes,
          transAmount: formData.transAmount,
          transDate: selectedDate,
          bankId: selectBankId,
          feeIncurred: formData.feeIncurred,
          bankAccount: "",
        });
        if (response && response.success === false) {
          toast.error(response.message || "Thêm mới giao dịch lỗi.");
          setLoading(false);
          setIsAddTransaction(false);
          return;
        }
        console.log("Dữ liệu đã được thêm mới:", response);
        toast.success("Thêm mới giao dịch thành công!");
      }

      setAddModalOpen(false);
      form.resetFields();
      setCurrentTransaction(null);
      fetchTransaction();
      setSelectBankId(0);
    } catch (error) {
      setIsAddTransaction(false);
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 400) {
          const message =
            error.response.data.message ||
            "Vui lòng nhập các trường dữ liệu để thêm mới!";
          toast.error(message);
        } else {
          toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
        }
      } else {
        toast.error("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleEdit = (record: TransactionModal) => {
  //   console.log("data edit", record);
  //   setCurrentTransaction(record);
  //   form.setFieldsValue({
  //     id: record.id,
  //     bankName: record.bankName,
  //     bankAccountId: record.bankAccountId,
  //     fullName: record.fullName,
  //     transDateString: record.transDateString,
  //     transType: record.transType,
  //     purposeDescription: record.purposeDescription,
  //     reason: record.reason,
  //     balanceBeforeTrans: record.balanceBeforeTrans,
  //     currentBalance: record.currentBalance,
  //     notes: record.notes,
  //     transAmount: record.transAmount,
  //     transDate: selectedDate,
  //     feeIncurred: record.feeIncurred,
  //     bankAccountName: record.bankAccount + " - " + record.fullName,
  //   });
  //   setAddModalOpen(true);
  // };

  const handleDelete = async (x: TransactionModal) => {
    setLoading(true);
    try {
      setAddModalOpen(false);
      await deleteTransaction(x.id);
      await fetchTransaction();
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<TransactionModal | null>(null);

  const handleDeleteClick = (tele: TransactionModal) => {
    setSelectedAccountGroup(tele);
    setIsDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedAccountGroup(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAccountGroup) {
      handleDelete(selectedAccountGroup);
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    fetchTransaction(globalTerm);
  }, [globalTerm]);

  useEffect(() => {
    fetchTransaction();
  }, [keys]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", hidden: true },
    {
      title: "Ngân hàng",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "transDate",
      key: "transDate",
      hidden: true,
    },
    {
      title: "transAmount",
      dataIndex: "transAmount",
      key: "transAmount",
      hidden: true,
    },
    {
      title: "Chi phí phát sinh",
      dataIndex: "feeIncurred",
      key: "feeIncurred",
      // hidden: true,
    },
    {
      title: "Số tài khoản",
      dataIndex: "bankAccountId",
      key: "bankAccountId",
      hidden: true,
    },
    { title: "Số tài khoản", dataIndex: "bankAccount", key: "bankAccount" },
    { title: "Tên chủ tài khoản", dataIndex: "fullName", key: "fullName" },
    {
      title: "Ngày giao dịch",
      dataIndex: "transDateString",
      key: "transDateString",
    },
    {
      title: "Giao dịch",
      dataIndex: "transType",
      key: "transType",
      render: (transType: string) => (
        <>
          {transType == "2" ? (
            <div className="font-semibold text-[#D40606]">Tiền ra</div>
          ) : transType == "3" ? (
            <div className="font-semibold text-[#01AF36]">Tiền vào</div>
          ) : (
            <div className="font-semibold">Không xác định</div>
          )}
        </>
      ),
    },
    {
      title: "Mục đích",
      dataIndex: "purposeDescription",
      key: "purposeDescription",
    },
    { title: "Lý do", dataIndex: "reason", key: "reason" },
    {
      title: "Số tiền",
      dataIndex: "balanceBeforeTrans",
      key: "balanceBeforeTrans",
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
    {
      title: "Số dư hiện tại",
      dataIndex: "currentBalance",
      key: "currentBalance",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (balance: any) =>
        balance.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Chức năng",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (record: TransactionModal) => (
        <Space size="middle">
          {/* <Button onClick={() => handleEdit(record)} icon={<EditOutlined />}>
            Chỉnh sửa
          </Button> */}
          <Button
            onClick={() => handleDeleteClick(record)}
            icon={<DeleteOutlined />}
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const [selectedDate, setSelectedDate] = useState("");
  const [selectBankId, setSelectBankId] = useState(0);

  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">
          Danh sách giao dịch thủ công
        </div>
        <div className="flex justify-between items-center mb-7">
          <div>
            <Input
              placeholder="Tìm kiếm số tài khoản ..."
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
          </div>
          <Button
            className="bg-[#4B5CB8] w-[136px] !h-10 text-white font-medium hover:bg-[#3A4A9D]"
            onClick={() => {
              setCurrentTransaction(null);
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
          <Table columns={columns} dataSource={dataTransaction} rowKey="id" />
        )}
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        title={
          currentTransaction
            ? "Chỉnh sửa giao dịch thủ công"
            : "Thêm mới giao dịch thủ công"
        }
      >
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col gap-1 w-full"
          onFinish={handleAddConfirm}
        >
          <Form.Item hidden label="id" name="id">
            <Input hidden />
          </Form.Item>
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Ngân hàng"
              name="bankName"
              rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
            >
              <Select
                allowClear
                placeholder="Chọn ngân hàng"
                onFocus={fetchBankData}
                options={banks}
                onChange={(value: string | null) => {
                  if (!value) {
                    form.setFieldsValue({
                      bankId: undefined,
                      bankAccountName: undefined,
                      bankAccountId: undefined,
                    });
                    return;
                  }
                  const selectedGroup = banks.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (item: any) => item.value === value
                  );
                  if (selectedGroup) {
                    genBankAccountData(selectedGroup.bankId);
                    form.setFieldsValue({
                      bankId: selectedGroup.bankId,
                      bankAccountName: undefined,
                      bankAccountId: undefined,
                    });
                  }
                }}
              />
            </Form.Item>

            <Form.Item hidden label="Id Ngân hàng 2" name="bankId">
              <Select placeholder="Chọn ngân hàng 2" />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Tài khoản ngân hàng"
              name="bankAccountName"
              rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
            >
              <Select
                allowClear
                placeholder="Chọn tài khoản ngân hàng"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onFocus={() => {
                  const formData = form.getFieldsValue();
                  genBankAccountData(formData.bankId);
                }}
                options={bankAccount}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={async (value: any) => {
                  // console.log(value);
                  const selectedGroup = await bankAccount.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (item: any) => item.value === value
                  );
                  if (selectedGroup) {
                    genBankAccountData(selectedGroup.bankAccountId);
                    form.setFieldsValue({
                      bankAccountId: selectedGroup.bankAccountId,
                    });
                  }
                }}
              />
            </Form.Item>
            <Form.Item hidden label="Id Ngân hàng 2" name="bankAccountId">
              <Select placeholder="Chọn ngân hàng 2" />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Chọn loại giao dịch"
              name="transType"
              rules={[
                { required: true, message: "Vui lòng chọn loại giao dịch!" },
              ]}
            >
              <Select
                options={[
                  { value: "2", label: "Tiền ra" },
                  { value: "3", label: "Tiền vào" },
                ]}
                placeholder="Chọn loại giao dịch"
                onChange={(value) => {
                  console.log(value);
                }}
              />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Mục đích giao dịch"
              name="purposeDescription"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn mục đích giao dịch!",
                },
              ]}
            >
              <Select
                options={[
                  { value: "1", label: "Rút tiền mặt" },
                  { value: "2", label: "Mua tài sản" },
                  { value: "3", label: "Bổ sung giao dịch lỗi" },
                ]}
                placeholder="Chọn mục đích giao dịch"
              />
            </Form.Item>
          </div>
          <div className="flex justify-between items-center">
            <Form.Item
              className="w-[45%]"
              label="Ngày giao dịch"
              name="transDate"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày giao dịch!",
                },
              ]}
            >
              <Space direction="vertical" size="large" className="w-full">
                <DatePicker
                  className="w-full"
                  showTime
                  required
                  disabledDate={(current) => {
                    return current && current.isAfter(dayjs());
                  }}
                  onChange={async (value: Dayjs | null) => {
                    const formattedDate = value?.format(
                      "YYYY-MM-DDTHH:mm:ss.SSSZ"
                    );
                    setSelectedDate(formattedDate!);
                    // console.log("Selected Time: ", formattedDate);
                  }}
                />
              </Space>
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Số dư trước giao dịch"
              name="balanceBeforeTrans"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số dư trước giao dịch!",
                },
                {
                  validator: (_, value) =>
                    value > 0
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Số dư trước giao dịch phải lớn hơn 0!")
                        ),
                },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="Nhập số dư trước giao dịch"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                parser={(value: any) => value.replace(/\s?VND|(,*)/g, "")}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Số tiền giao dịch"
              name="transAmount"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số tiền giao dịch!",
                },
                {
                  validator: (_, value) =>
                    value > 0
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Số tiền giao dịch phải lớn hơn 0!")
                        ),
                },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="Nhập số tiền giao dịch"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                parser={(value: any) => value.replace(/\s?VND|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Số dư sau giao dịch"
              name="currentBalance"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số dư sau giao dịch!",
                },
                {
                  validator: (_, value) =>
                    value > 0
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Số dư sau giao dịch phải lớn hơn 0!")
                        ),
                },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="Nhập số dư sau giao dịch"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                parser={(value: any) => value.replace(/\s?VND|(,*)/g, "")}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Nhập chi phí phát sinh"
              name="feeIncurred"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập chi phí phát sinh!",
                },
                {
                  validator: (_, value) =>
                    value > 0
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Chi phí phát sinh phải lớn hơn 0!")
                        ),
                },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="Nhập chi phí phát sinh"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                parser={(value: any) => value.replace(/\s?VND|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Nhập lý do"
              name="reason"
              rules={[
                {
                  required: true,
                  message: "Vui lòng Nhập lý do!",
                },
              ]}
            >
              <Input placeholder="Nhập lý do" />
            </Form.Item>
          </div>
          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea
              placeholder="Nhập ghi chú"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <div className="flex justify-end pt-5">
            <Button
              onClick={() => setAddModalOpen(false)}
              className="w-[189px] !h-10"
            >
              Đóng
            </Button>
            <div className="w-4" />
            <Button
              type="primary"
              onClick={() => handleAddConfirm(false)}
              className="bg-[#4B5CB8] border text-white font-medium w-[189px] !h-10"
              loading={isAddTransaction}
            >
              {currentTransaction ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
      <DeleteModal
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        transaction={selectedAccountGroup}
      />
    </>
  );
};

export default Transaction;
