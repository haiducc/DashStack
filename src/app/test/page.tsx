"use client"

import React, { useState, useEffect } from "react";
import { Input, Select } from "antd";
import { useFilter } from "@/src/utils/handleChange";
import { getListTelegram } from "@/src/services/telegram";
import { fetchBankAccounts } from "@/src/services/bankAccount";

const { Option } = Select;

const FilterComponent: React.FC = () => {
  const { handleChange } = useFilter();
  const [globalTerm, setGlobalTerm] = useState<string>('');
  const [teleGroupChatFilter, setTeleGroupChatFilter] = useState<
    { value: string; label: string }[]
  >([]);
  const [bankFilter, setBankFilter] = useState<
    { value: string; label: string }[]
  >([]);

  const handleFilterGroupChat = async () => {
    try {
      const { data } = await getListTelegram(1, 20);
      const res =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.source?.map((x: any) => ({
          value: x.id,
          label: x.name || "Không xác định",
        })) || [];
      setTeleGroupChatFilter(res);
    } catch (error) {
      console.error("Lỗi khi lấy nhóm chat Telegram:", error);
    }
  };

  const bankAccountFilterAPI = async () => {
    try {
      const { data } = await fetchBankAccounts(1, 20);
      const res =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.source?.map((bank: any) => ({
          value: bank.id,
          label: bank.bank.code,
        })) || [];
      setBankFilter(res);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ngân hàng:", error);
    }
  };

  useEffect(() => {
    Promise.all([handleFilterGroupChat(), bankAccountFilterAPI()]);
  }, []);

  const handleSearch = (value: string) => {
    setGlobalTerm(value);
    const params = {
      pageIndex: 1,
      pageSize: 20,
      globalTerm: value,
    };
    console.log(params);
    // Ở đây có thể gọi API với params nếu cần
    // apiCall(params);
  };

  return (
    <>
      <div>
        <Input
          placeholder="Tìm kiếm toàn cầu ..."
          style={{
            width: 253,
            borderRadius: 10,
            height: 38,
            marginRight: 15,
          }}
          value={globalTerm}
          onChange={(e) => {
            const value = e.target.value;
            setGlobalTerm(value);
          }}
          onPressEnter={async (e) => {
            handleSearch(e.currentTarget.value);
          }}
        />
      </div>
      <div>
        <Select
          allowClear
          mode="multiple"
          placeholder="Chọn danh mục"
          style={{ width: 200, marginRight: 10 }}
          onChange={(value) => handleChange(value, "category")}
        >
          <Option value="electronics">Điện tử</Option>
          <Option value="fashion">Thời trang</Option>
          <Option value="books">Sách</Option>
        </Select>
      </div>
      <div>
        <Select
          allowClear
          placeholder="Chọn nhóm chat Telegram"
          style={{ width: 200, marginTop: 10 }}
          onChange={(value) => handleChange(value, "groupChatId")}
          options={teleGroupChatFilter}
        />
      </div>
      <div>
        <Select
          mode="multiple"
          allowClear
          placeholder="Chọn ngân hàng"
          style={{ width: 200, marginTop: 10 }}
          onChange={(value) => handleChange(value, "bankAccountId")}
          options={bankFilter}
        />
      </div>
    </>
  );
};

export default FilterComponent;
