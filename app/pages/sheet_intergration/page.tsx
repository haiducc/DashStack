"use client";

import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "@/app/component/Header";
import { Button, Form, Input, Modal, Select, Space, Spin, Table } from "antd";
import {
  addSheetIntergration,
  deleteSheetIntergration,
  getListSheetIntergration,
} from "@/app/services/sheet_intergration";
import BaseModal from "@/app/component/config/BaseModal";
import { fetchBankAccounts } from "@/app/services/bankAccount";
import { getListSheet } from "@/app/services/sheet";

export interface ListSheetIntegration {
  id: number;
  code: string;
  accountNumber: string;
  fullName: string;
  linkUrl: string;
  transType: string;
  bankAccountId: number;
  sheetId: number;
}

const SheetIntergration = () => {
  const [form] = Form.useForm();
  const [dataSheetIntegration, setDataSheetIntegration] = useState<
    ListSheetIntegration[]
  >([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [globalTerm, setGlobalTerm] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentSheet, setCurrentSheet] = useState<ListSheetIntegration | null>(
    null
  );
  const [banks, setBanks] = useState([]);
  const [sheet, setSheet] = useState([]);

  const fetchSheetIntegration = async (globalTerm = "") => {
    setLoading(true);
    try {
      const response = await getListSheetIntergration(1, 50, globalTerm);
      console.log(response, "getListSheetIntergration");
      const formattedData =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response?.data?.source?.map((item: any) => ({
          id: item.id?.toString() || Date.now().toString(), // id
          code: item.bank.code, // Mã ngân hàng
          accountNumber: item.bankAccount.accountNumber, // stk
          fullName: item.bankAccount.fullName, // tên chủ tk
          linkUrl: item.sheetDetail.linkUrl, // link url
          transType: item.transType, // status loại giao dịch
          bankAccountId: item.bankAccount.id,
          sheetId: item.sheetDetail.linkUrl, // id của sheet
        })) || [];
      setDataSheetIntegration(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetIntegration(globalTerm);
  }, [globalTerm]);

  const genBankData = async () => {
    try {
      const bankData = await fetchBankAccounts(1, 50);
      const formattedBanks =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bankData?.data?.source?.map((bank: any) => ({
          value: bank.id,
          // label: bank.accountNumber || bank.code || "Không xác định",
          label: `${bank.accountNumber} - ${bank.bank.code} - ${bank.fullName}`,
        })) || [];
      setBanks(formattedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const genSheetData = async () => {
    try {
      const dataTelegram = await getListSheet(1, 50);
      const formattedTelegram =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataTelegram?.data?.source?.map((sheet: any) => ({
          value: sheet.id,
          label: sheet.name,
        })) || [];
      setSheet(formattedTelegram);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  const handleAddConfirm = async () => {
    const formData = form.getFieldsValue();
    setLoading(true);

    try {
      if (currentSheet) {
        const response = await addSheetIntergration({
          id: formData.id?.toString() || Date.now().toString(), // id
          code: formData.code, // Mã ngân hàng
          accountNumber: formData.accountNumber, // stk
          fullName: formData.fullName, // tên chủ tk
          linkUrl: formData.linkUrl, // link url
          transType: formData.transType, // status loại giao dịch
          bankAccountId: formData.bankAccountId,
          sheetId: formData.linkUrl, // id của sheet
        });
        console.log("Dữ liệu đã được cập nhật:", response);
      } else {
        const response = await addSheetIntergration({
          id: formData.id, // id
          code: formData.code, // Mã ngân hàng
          accountNumber: formData.accountNumber, // stk
          fullName: formData.fullName, // tên chủ tk
          linkUrl: formData.linkUrl, // link url // đổi tên thử thành sheetId
          transType: formData.transType, // status loại giao dịch
          bankAccountId: formData.bankAccountId, // hình như không nhầm thì là lưu stk vào trường có tên là bankAccountId
          sheetId: formData.linkUrl, // id của sheet
        });
        console.log("Dữ liệu đã được thêm mới:", response);
      }

      setAddModalOpen(false);
      form.resetFields();
      setCurrentSheet(null);
      fetchSheetIntegration();
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: ListSheetIntegration) => {
    console.log("data edit", record);
    setCurrentSheet(record);
    form.setFieldsValue({
      id: record.id?.toString() || Date.now().toString(), // id
      code: record.code, // Mã ngân hàng
      accountNumber: record.accountNumber, // stk
      fullName: record.fullName, // tên chủ tk
      linkUrl: record.linkUrl, // link url
      transType: record.transType, // status loại giao dịch
      bankAccountId: record.bankAccountId,
      sheetId: record.sheetId, // id của sheet
    });
    setAddModalOpen(true);
  };

  const handleDelete = (x: ListSheetIntegration) => {
    Modal.confirm({
      title: "Xóa nhóm tích hợp trang tính",
      content: `Bạn có chắc chắn chấp nhận xóa nhóm telegram này không?`,
      onOk: async () => {
        setLoading(true);
        try {
          await deleteSheetIntergration(x.id);
          await fetchSheetIntegration();
        } catch (error) {
          console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    try {
      if (value.trim() === "") {
        const data = await getListSheetIntergration(1, 20);
        const formattedData =
          data?.data?.source?.map((x: ListSheetIntegration) => ({
            id: x.id?.toString() || Date.now().toString(), // id
            code: x.code, // Mã ngân hàng
            accountNumber: x.accountNumber, // stk
            fullName: x.fullName, // tên chủ tk
            linkUrl: x.linkUrl, // link url
            transType: x.transType, // status loại giao dịch
            bankAccountId: x.bankAccountId,
            sheetId: x.sheetId, // id của sheet
          })) || [];

        setDataSheetIntegration(formattedData);
      } else {
        const data = await getListSheetIntergration(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: ListSheetIntegration) => ({
            id: x.id?.toString() || Date.now().toString(), // id
            code: x.code, // Mã ngân hàng
            accountNumber: x.accountNumber, // stk
            fullName: x.fullName, // tên chủ tk
            linkUrl: x.linkUrl, // link url
            transType: x.transType, // status loại giao dịch
            bankAccountId: x.bankAccountId,
            sheetId: x.sheetId, // id của sheet
          })) || [];

        setDataSheetIntegration(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản ngân hàng:", error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", hidden: true },
    {
      title: "bankAccountId",
      dataIndex: "bankAccountId",
      key: "bankAccountId",
      // hidden: true
    },
    { title: "Ngân hàng", dataIndex: "code", key: "code" },
    { title: "Số tài khoản", dataIndex: "accountNumber", key: "accountNumber" },
    { title: "Tên chủ tài khoản", dataIndex: "fullName", key: "fullName" },
    { title: "Tên trang tính", dataIndex: "linkUrl", key: "linkUrl" },
    {
      title: "Loại giao dịch",
      dataIndex: "transType",
      key: "transType",
      render: (transType: string) => (
        <>
          {transType === "1" ? (
            <div className="font-semibold text-[#0356B6]">Cả hai</div>
          ) : transType === "2" ? (
            <div className="font-semibold text-[#D40606]">Tiền ra</div>
          ) : (
            <div className="font-semibold text-[#01AF36]">Tiền vào</div>
          )}
        </>
      ),
    },
    {
      title: "Chức năng",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (record: ListSheetIntegration) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />}>
            Chỉnh sửa
          </Button>
          <Button
            onClick={() => handleDelete(record)}
            icon={<DeleteOutlined />}
            danger
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
        <div className="text-[32px] font-bold py-5">
          Danh sách tích hợp trang tính
        </div>
        <div className="flex justify-between items-center mb-7">
          <div>
            <Input
              placeholder="Tìm kiếm tên tài khoản ..."
              style={{
                width: 253,
                borderRadius: 10,
                height: 38,
                marginRight: 15,
              }}
              onChange={(e) => {
                const value = e.target.value;
                handleSearch(value);
              }}
              onPressEnter={async (e) => {
                handleSearch(e.currentTarget.value);
              }}
            />
            <Space direction="horizontal" size="middle">
              {["Nhóm telegram", "Loại giao dịch", "Tên ngân hàng"].map(
                (placeholder, index) => (
                  <Select
                    allowClear
                    key={index}
                    // options={accountGroup}
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
              setCurrentSheet(null);
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
          <Table
            columns={columns}
            dataSource={dataSheetIntegration}
            rowKey="id"
          />
        )}
      </div>
      <BaseModal
        open={isAddModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        title={
          currentSheet
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
          <Form.Item hidden label="groupChatId" name="groupChatId">
            <Input hidden />
          </Form.Item>
          <Form.Item
            label="Tài khoản ngân hàng"
            name="bankAccountId"
            rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
          >
            <Select
              placeholder="Chọn ngân hàng"
              onFocus={genBankData}
              options={banks}
            />
          </Form.Item>
          <Form.Item
          hidden
            label="Tài khoản ngân hàng"
            name="accountNumber"
            rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
          >
            <Select
              placeholder="Chọn ngân hàng"
              onFocus={genBankData}
              options={banks}
            />
          </Form.Item>
          <Form.Item
            label="Chọn nhóm trang tính"
            name="linkUrl"
            rules={[
              { required: true, message: "Vui lòng chọn nhóm trang tính!" },
            ]}
          >
            <Select
              placeholder="Chọn nhóm trang tính"
              onFocus={genSheetData}
              options={sheet}
            />
          </Form.Item>
          <Form.Item
            hidden
            label="Chọn nhóm trang tính 2"
            name="sheetId"
            rules={[
              { required: true, message: "Vui lòng chọn nhóm trang tính!" },
            ]}
          >
            <Select
              placeholder="Chọn nhóm trang tính"
              onFocus={genSheetData}
              options={sheet}
            />
          </Form.Item>
          <Form.Item
            label="Chọn loại giao dịch"
            name="transType"
            rules={[
              { required: true, message: "Vui lòng chọn loại tài khoản!" },
            ]}
          >
            <Select
              options={[
                { value: "1", label: "Cả 2" },
                { value: "2", label: "Tiền ra" },
                { value: "3", label: "Tiền vào" },
              ]}
              placeholder="Chọn loại giao dịch"
            />
          </Form.Item>
          <div className="flex justify-end">
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
              {currentSheet ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
    </>
  );
};

export default SheetIntergration;
