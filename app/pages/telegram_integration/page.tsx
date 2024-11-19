"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/component/Header";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space, Spin, Table } from "antd";
import {
  addTelegramIntergration,
  deleteTelegramIntergration,
  getListTelegramIntergration,
} from "@/app/services/telegram_intergration_list";
import BaseModal from "@/app/component/config/BaseModal";
import { fetchBankAccounts } from "@/app/services/bankAccount";
import { getListTelegram, getTransType } from "@/app/services/telegram";
import DeleteModal from "@/app/component/config/modalDelete";

export interface ListTelegramIntegration {
  chatName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groupChatId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bankAccountId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bankId: any;
  id: number;
  code: string;
  accountNumber: number;
  fullName: string;
  chatId: string;
  name: string;
  transType: string;
}

interface filterTeleIntergration {
  Name: string;
  Value: string;
}

const TelegramIntegration = () => {
  const [form] = Form.useForm();
  const [dataTelegramIntegration, setDataTelegramIntegration] = useState<
    ListTelegramIntegration[]
  >([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentTelegram, setCurrentTelegram] =
    useState<ListTelegramIntegration | null>(null);
  const [banks, setBanks] = useState([]);
  const [telegram, setTelegram] = useState<Array<ListTelegramIntegration>>([]);
  const [loading, setLoading] = useState(false);
  const [globalTerm, setGlobalTerm] = useState("");
  const [pageIndex] = useState(1);
  const [pageSize] = useState(50);

  const [keys, setKeys] = useState<string | null>(null);
  const [values, setValues] = useState<string | null>(null);
  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchListTelegramIntegration = async (
    globalTerm?: string,
    groupChat?: string
  ) => {
    const arrTeleAccount: filterTeleIntergration[] = [];
    const addedParams = new Set<string>();

    if (groupChat && !addedParams.has("bankAccountId")) {
      arrTeleAccount.push({
        Name: "groupChatId",
        Value: groupChat,
      });
      addedParams.add("groupChatId");
    }

    arrTeleAccount.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);

    console.log(groupChat, "groupChat");

    setLoading(true);
    try {
      const response = await getListTelegramIntergration(
        pageIndex,
        pageSize,
        globalTerm,
        arrTeleAccount
      );
      console.log(response, "bankAccount");
      const formattedData =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response?.data?.source?.map((item: any) => {
          // console.log(item.bankAccount.id);
          return {
            id: item.id?.toString() || Date.now().toString(), // id
            bankAccountId: item.bankAccount.id, // id tài khoản ngân hàng
            groupChatId: item.groupChatId, // id nhóm chat tele
            code: item.bank.code, // mã ngân hàng
            accountNumber: item.bankAccount.accountNumber, // stk
            fullName: item.bankAccount.fullName, // tên chủ tk
            chatId: item.groupChat.chatId, // mã nhóm chat tele
            name: item.groupChat.name, // tên nhóm chat
            transType: item.transType, // loại giao dịch
            bankId: item.bank.name,
            chatName: item.groupChat.name,
          };
        }) || [];

      setDataTelegramIntegration(formattedData);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListTelegramIntegration();
  }, [keys]);

  const genBankData = async () => {
    try {
      const bankData = await fetchBankAccounts(1, 50);
      const formattedBanks =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bankData?.data?.source?.map((bank: any) => ({
          value: bank.id,
          label: `${bank.accountNumber} - ${bank.bank.code} - ${bank.fullName}`,
        })) || [];

      setBanks(formattedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const genTelegramData = async () => {
    try {
      const dataTelegram = await getListTelegram(1, 50);
      console.log(dataTelegram);

      const formattedTelegram =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataTelegram?.data?.source?.map((tele: any) => ({
          value: tele.id,
          label: tele.name,
          groupChatId: tele.id,
        })) || [];
      setTelegram(formattedTelegram);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  const [tranType, setTransType] = useState();

  const genTransTypes = async (x?: ListTelegramIntegration) => {
    try {
      const dataTransType = await getTransType(
        x!.bankAccountId,
        x!.groupChatId,
        x!.id
      );
      const res =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await dataTransType?.data?.map((tele: any) => ({
          value: tele.value,
          label: tele.text,
        }))) || [];
      setTransType(res);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  const handleAddConfirm = async () => {
    if (loading) return; // Nếu đang loading thì không làm gì cả

    try {
      await form.validateFields();
      setLoading(true); // Chỉ định `loading` true ngay khi bắt đầu xử lý

      const formData = form.getFieldsValue();
      let response;

      if (currentTelegram) {
        response = await addTelegramIntergration({
          bankAccountId: formData.bankAccountId,
          id: currentTelegram.id,
          groupChatId: formData.groupChatId,
          transType: formData.transType,
          accountNumber: formData.accountNumber,
          chatName: "",
          bankId: undefined,
          code: "",
          fullName: "",
          chatId: "",
          name: "",
        });
        console.log("Dữ liệu đã được cập nhật:", response);
      } else {
        // Thêm mới bản ghi
        response = await addTelegramIntergration({
          bankAccountId: bankAccountIdSelect,
          id: formData.id,
          groupChatId: formData.groupChatId,
          transType: formData.transType,
          accountNumber: formData.accountNumber,
          chatName: "",
          bankId: undefined,
          code: "",
          fullName: "",
          chatId: "",
          name: "",
        });
        console.log("Dữ liệu đã được thêm mới:", response);
      }

      setAddModalOpen(false); // Đóng popup sau khi thành công
      form.resetFields();
      setCurrentTelegram(null);
      fetchListTelegramIntegration();
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false); // Đặt lại `loading` về `false` khi hoàn tất
    }
  };

  const handleEdit = (record: ListTelegramIntegration) => {
    console.log("data edit", record);
    setCurrentTelegram(record);
    form.setFieldsValue({
      bankAccountId: record.bankAccountId,
      accountNumber: record.accountNumber,
      id: record.id,
      groupChatId: record.groupChatId,
      transType: record.transType,
      accountFullName:
        record.accountNumber + " - " + record.code + " - " + record.fullName,
      chatName: record.chatName,
    });
    setAddModalOpen(true);
  };

  const handleDelete = async (x: ListTelegramIntegration) => {
    setLoading(true);
    try {
      await deleteTelegramIntergration(x.id);
      await fetchListTelegramIntegration();
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản ngân hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setGlobalTerm(value);
    try {
      if (value.trim() === "") {
        const data = await getListTelegram(1, 20);
        const formattedData =
          data?.data?.source?.map((x: ListTelegramIntegration) => ({
            bankAccountId: x.accountNumber,
            id: x.id, // id của bản ghi
            groupChatId: x.groupChatId, // id nhóm chat trên Telegram
            transType: x.transType,
            accountNumber: x.accountNumber,
            chatName: "",
            bankId: undefined,
            code: "",
            fullName: "",
            chatId: "",
            name: "",
          })) || [];

        setDataTelegramIntegration(formattedData);
      } else {
        // Nếu có giá trị tìm kiếm, gọi API với giá trị đó
        const data = await getListTelegram(1, 20, value);
        const formattedData =
          data?.data?.source?.map((x: ListTelegramIntegration) => ({
            bankAccountId: x.accountNumber,
            id: x.id, // id của bản ghi
            groupChatId: x.groupChatId, // id nhóm chat trên Telegram
            transType: x.transType,
            accountNumber: x.accountNumber,
            chatName: "",
            bankId: undefined,
            code: "",
            fullName: "",
            chatId: "",
            name: "",
          })) || [];

        setDataTelegramIntegration(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản ngân hàng:", error);
    }
  };

  useEffect(() => {
    fetchListTelegramIntegration();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", hidden: true },
    { title: "Ngân hàng", dataIndex: "code", key: "code" },
    { title: "Số tài khoản", dataIndex: "accountNumber", key: "accountNumber" },
    { title: "Tên chủ tài khoản", dataIndex: "fullName", key: "fullName" },
    { title: "ID nhóm telegram", dataIndex: "chatId", key: "chatId" },
    { title: "Tên nhóm telegram", dataIndex: "name", key: "name" },
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
      render: (record: ListTelegramIntegration) => (
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] =
    useState<ListTelegramIntegration | null>(null);

  const handleDeleteClick = (tele: ListTelegramIntegration) => {
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

  const [teleGroupChatFilter, setTeleGroupChatFilter] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [groupChatFilter, setGroupChatFilter] = useState();

  const [filterParams, setFilterParams] = useState<{
    groupChatId?: string;
  }>({});

  const handleSelectChange = (groupChat?: string) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      groupChatId: groupChat,
    }));
  };

  const handleFilterGroupChat = async (groupChat?: string) => {
    const arr: filterTeleIntergration[] = [];
    const groupChatFilter: filterTeleIntergration = {
      Name: "groupChatId",
      Value: groupChat!,
    };
    const obj: filterTeleIntergration = {
      Name: keys!,
      Value: values!,
    };
    arr.push(obj, groupChatFilter);
    try {
      const fetchBankAccountAPI = await getListTelegram(
        pageIndex,
        pageSize,
        globalTerm,
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
        setTeleGroupChatFilter(res);
      } else {
        setTeleGroupChatFilter([]);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  useEffect(() => {
    // const { groupAccountId } = filterParams;

    const fetchData = async () => {
      await handleFilterGroupChat();
    };

    fetchData();
  }, [filterParams]);

  const [checkFilter, setCheckFilter] = useState(false);
  useEffect(() => {
    fetchListTelegramIntegration(groupChatFilter);
  }, [checkFilter]);

  const [bankAccountIdSelect, setBankAccountIdSelect] = useState();

  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">
          Danh sách tích hợp telegram
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
                setGlobalTerm(value);
                if (!value) {
                  setCheckFilter(!checkFilter);
                }
              }}
              onPressEnter={async (e) => {
                handleSearch(e.currentTarget.value);
              }}
            />
            <Space direction="horizontal" size="middle">
              <Select
                options={teleGroupChatFilter}
                placeholder="Nhóm tài khoản"
                style={{ width: 245 }}
                allowClear
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(value: any) => {
                  setGroupChatFilter(value);
                  if (!value) {
                    handleSelectChange(value);
                    setCheckFilter(!checkFilter);
                  } else {
                    fetchListTelegramIntegration(globalTerm, value);
                  }
                }}
              />
            </Space>
          </div>

          <Button
            className="bg-[#4B5CB8] w-[136px] h-[40px] text-white font-medium hover:bg-[#3A4A9D]"
            onClick={() => {
              setCurrentTelegram(null);
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
            dataSource={dataTelegramIntegration}
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
          currentTelegram
            ? "Chỉnh sửa nhóm tài khoản"
            : "Thêm mới nhóm tài khoản"
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
          <Form.Item hidden label="bankAccountId" name="bankAccountId">
            <Input />
          </Form.Item>
          <Form.Item
            label="Tài khoản ngân hàng"
            name="accountFullName"
            rules={[{ required: true, message: "Vui lòng chọn ngân hàng!" }]}
          >
            <Select
              placeholder="Chọn ngân hàng"
              onFocus={genBankData}
              options={banks}
              onChange={(value) => setBankAccountIdSelect(value)}
            />
          </Form.Item>
          <Form.Item
            label="Chọn nhóm telegram"
            name="chatName"
            rules={[
              { required: true, message: "Vui lòng chọn nhóm telegram!" },
            ]}
          >
            <Select
              placeholder="Chọn nhóm telegram"
              onFocus={genTelegramData}
              options={telegram}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={async (value: any) => {
                const selectedGroup = await telegram.find(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (item: any) => item.value === value
                );
                if (selectedGroup) {
                  form.setFieldsValue({
                    groupChatId: selectedGroup.groupChatId,
                  });
                }
              }}
            />
          </Form.Item>
          <Form.Item
            hidden
            label="Chọn nhóm telegram 2"
            name="groupChatId"
            rules={[
              { required: true, message: "Vui lòng chọn nhóm telegram!" },
            ]}
          >
            <Select
              placeholder="Chọn nhóm telegram"
              onFocus={genTelegramData}
              options={telegram}
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
              placeholder="Chọn loại giao dịch"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onFocus={(value: any) => genTransTypes(value)}
              options={tranType}
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
              loading={loading}
              disabled={loading}
              className="bg-[#4B5CB8] border text-white font-medium w-[189px] h-[42px]"
            >
              {currentTelegram ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </BaseModal>
      <DeleteModal
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        handleDeleteTeleIntergration={selectedAccountGroup}
      />
    </>
  );
};

export default TelegramIntegration;
