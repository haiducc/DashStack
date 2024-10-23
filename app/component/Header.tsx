"use client";
import "./header.css";
import React from "react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Input } from "antd";
import Menu from "../../public/img/menu.png";
import Image from "next/image";

const Header = () => {
  const onSearch = (value: string) => {
    console.log("Search value: ", value);
  };

  return (
    <div className="bg-white flex justify-between px-[30px] h-[70px] header">
      <div className="flex items-center">
        <Image
          src={Menu}
          alt="Menu"
          width={22}
          height={24}
          className="mr-[30px]"
        />
        {/* Thanh tìm kiếm sẽ được ẩn trên các thiết bị di động */}
        <div className="search-container">
          <Input
            placeholder="Search"
            onPressEnter={(e) => onSearch(e.currentTarget.value)}
            style={{ width: 388, borderRadius: "30px", height: 38 }}
          />
        </div>
      </div>
      <div className="flex items-center">
        <Avatar size={44} icon={<UserOutlined />} />
        <div className="avatar-info px-5">
          <div className="text-sm font-bold">Hải Đức</div>
          <div className="text-xs font-semibold">Admin</div>
        </div>
        <div className="w-[18px] h-[18px] border border-solid border-[#5C5C5C] rounded-full flex items-center justify-center opacity-50 avt">
          <DownOutlined className="w-[6px] h-[4px]" />
        </div>
      </div>
    </div>
  );
};

export default Header;
