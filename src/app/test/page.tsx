"use client"
import React, { useState } from "react";
import { Select } from "antd";
import { buildSearchParams } from "@/src/utils/buildQueryParams";

const { Option } = Select;

const FilterComponent: React.FC = () => {
  const [searchTerms, setSearchTerms] = useState<
    { Name: string; Value: string | string[] }[]
  >([]);

  // Xử lý khi người dùng chọn giá trị trong Select
  const handleChange = (value: string | string[], name: string) => {
    const updatedTerms = [...searchTerms];
    const existingIndex = updatedTerms.findIndex((term) => term.Name === name);

    if (existingIndex > -1) {
      updatedTerms[existingIndex].Value = value;
    } else {
      updatedTerms.push({ Name: name, Value: value });
    }

    setSearchTerms(updatedTerms);

    // Chuyển đổi dữ liệu để truyền vào hàm buildSearchParams
    const formattedTerms = updatedTerms.map((term) => ({
      Name: term.Name,
      Value: Array.isArray(term.Value) ? term.Value.join(",") : term.Value,
    }));

    const params = buildSearchParams(formattedTerms, {
      pageIndex: 1,
      pageSize: 10,
    }); // Ví dụ thêm tham số bổ sung
    console.log("Params:", params); // Gọi API hoặc cập nhật dữ liệu ở đây
  };

  return (
    <div>
      <Select
      
        mode="multiple"
        placeholder="Chọn danh mục"
        style={{ width: 200, marginRight: 10 }}
        onChange={(value) => handleChange(value, "category")}
      >
        <Option value="electronics">Điện tử</Option>
        <Option value="fashion">Thời trang</Option>
        <Option value="books">Sách</Option>
      </Select>

      <Select
        placeholder="Chọn trạng thái"
        style={{ width: 200 }}
        onChange={(value) => handleChange(value, "status")}
      >
        <Option value="new">Mới</Option>
        <Option value="popular">Phổ biến</Option>
        <Option value="sale">Giảm giá</Option>
      </Select>
    </div>
  );
};

export default FilterComponent;
