"use client";

import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "@/app/component/Header";
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
} from "@/app/services/transaction";
import BaseModal from "@/app/component/config/BaseModal";
import { fetchBankAccounts, getBank } from "@/app/services/bankAccount";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import DeleteModal from "@/app/component/config/modalDelete";
import { Dayjs } from "dayjs";

export interface TransactionModal {
  id: number;
  bankName: string;
  bankAccountId: number;
  fullName: string;
  transDateString: string;
  transType: string;
  purposeDescription: string;
  reason: string;
  balanceBeforeTrans: number;
  currentBalance: number;
  notes: string;
  // bankAccountId: number;
}

interface filterRole {
  Name: string;
  Value: string;
}

const Transaction = () => {
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
  const [banks, setBanks] = useState([]);
  const [bankAccount, setBankAccount] = useState([]);
  const [pageIndex] = useState(1);
  const [pageSize] = useState(20);

  const [keys, setKeys] = useState<string | null>(null);
  const [values, setValues] = useState<string | null>(null);
  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchTransaction = async (
    globalTerm?: string
    // searchTerms?: string
  ) => {
    const arrRole: filterRole[] = [];
    const obj: filterRole = {
      Name: keys!,
      Value: values!,
    };
    arrRole.push(obj);
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
          id: item.id?.toString() || Date.now().toString(), // id
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
          label: bank.fullName || bank.code || "Không xác định",
        })) || [];
      setBanks(formattedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const genBankAccountData = async () => {
    try {
      const bankData = await fetchBankAccounts(1, 50);
      const formattedBanks =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bankData?.data?.source?.map((bank: any) => ({
          value: bank.id,
          label: `${bank.accountNumber} - ${bank.fullName}`,
        })) || [];
      setBankAccount(formattedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const handleAddConfirm = async () => {
    const formData = form.getFieldsValue();
    setLoading(true);
    console.log(formData, "formData");
    try {
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
        });
        if (response && response.success === false) {
          toast.error(response.message || "Cập nhật giao dịch lỗi.");
          setLoading(false);
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
        });
        if (response && response.success === false) {
          toast.error(response.message || "Thêm mới giao dịch lỗi.");
          setLoading(false);
          return;
        }
        console.log("Dữ liệu đã được thêm mới:", response);
        toast.success("Thêm mới giao dịch thành công!");
      }

      setAddModalOpen(false);
      form.resetFields();
      setCurrentTransaction(null);
      fetchTransaction();
    } catch (error) {
      console.error("Lỗi:", error);

      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 400) {
          const message = error.response.data.message || "Có lỗi xảy ra.";
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

  const handleEdit = (record: TransactionModal) => {
    console.log("data edit", record);
    setCurrentTransaction(record);
    form.setFieldsValue({
      id: record.id,
      bankName: record.bankName,
      bankAccountId: record.bankAccountId,
      fullName: record.fullName,
      transDateString: record.transDateString,
      transType: record.transType,
      purposeDescription: record.purposeDescription,
      reason: record.reason,
      balanceBeforeTrans: record.balanceBeforeTrans,
      currentBalance: record.currentBalance,
      notes: record.notes,
    });
    setAddModalOpen(true);
  };

  const handleDelete = async (x: TransactionModal) => {
    setLoading(true);
    try {
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
    // {
    //   title: "bankAccountId",
    //   dataIndex: "bankAccountId",
    //   key: "bankAccountId",
    // },
    { title: "ID", dataIndex: "id", key: "id" },
    // {
    //   title: "bankAccountId",
    //   dataIndex: "bankAccountId",
    //   key: "bankAccountId",
    // },
    { title: "Ngân hàng", dataIndex: "bankName", key: "bankName" },
    { title: "Số tài khoản", dataIndex: "bankAccountId", key: "bankAccountId" },
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
          {transType === "2" ? (
            <div className="font-semibold text-[#D40606]">Tiền ra</div>
          ) : (
            <div className="font-semibold text-[#01AF36]">Tiền vào</div>
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // render: (balance: any) => {
      //   const formattedBalance = Math.abs(balance).toLocaleString("vi-VN", {
      //     style: "currency",
      //     currency: "VND",
      //   });
      //   return`- ${formattedBalance}`
      // },
    },
    {
      title: "Số dư hiện tại",
      dataIndex: "currentBalance",
      key: "currentBalance",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // render: (balance: any) =>
      //   balance.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Chức năng",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (record: TransactionModal) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />}>
            Chỉnh sửa
          </Button>
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

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
            className="bg-[#4B5CB8] w-[136px] h-[40px] text-white font-medium hover:bg-[#3A4A9D]"
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
          <Spin spinning={loading} />
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
            ? "Chỉnh sửa tích hợp trang tính"
            : "Thêm mới tích hợp trang tính"
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
          {/* <Form.Item hidden label="bankAccountId" name="bankAccountId">
            <Input hidden />
          </Form.Item> */}
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Ngân hàng"
              name="bankName"
              rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
            >
              <Select
                placeholder="Chọn ngân hàng"
                onFocus={fetchBankData}
                options={banks}
              />
            </Form.Item>
            <Form.Item
              className="w-[45%]"
              label="Tài khoản ngân hàng"
              name="bankAccountId"
              rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
            >
              <Select
                placeholder="Chọn tài khoản ngân hàng"
                onFocus={genBankAccountData}
                options={bankAccount}
              />
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
            {/* <div className="w-[50%] pb-8">
              <div className="p-2">Ngày giao dịch</div>
              <Space direction="vertical" size="large" className="w-full">
                <DatePicker
                  placeholder="Ngày giao dịch"
                  className="w-[90%]"
                  showTime
                  required
                  onChange={(value, dateString) => {
                    console.log("Selected Time: ", value);
                    console.log("Formatted Selected Time: ", dateString);
                  }}
                  onOk={onOk}
                />
              </Space>
            </div> */}
            <Form.Item
              className="w-[45%]"
              label="Ngày giao dịch"
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
                  onChange={(value: Dayjs | null) => {
                    setSelectedDate(value);
                    console.log(
                      "Selected Time: ",
                      value?.format("YYYY-MM-DD HH:mm:ss")
                    );
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
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="Nhập số dư trước giao dịch"
                // formatter={(value) =>
                //   `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                // }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                // parser={(value: any) => value.replace(/\s?VND|(,*)/g, "")}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <Form.Item
              className="w-[45%]"
              label="Số tiền giao dịch"
              name="transactionAmount"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số tiền giao dịch!",
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
              name="incurredCost"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập chi phí phát sinh!",
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
              label="Chọn lý do"
              name="reason"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn lý do!",
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
              className="w-[189px] h-[42px]"
            >
              Đóng
            </Button>
            <div className="w-4" />
            <Button
              type="primary"
              onClick={handleAddConfirm}
              className="bg-[#4B5CB8] border text-white font-medium w-[189px] h-[42px]"
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
