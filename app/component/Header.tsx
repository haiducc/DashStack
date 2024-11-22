"use client";
import "./header.css";
import React from "react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
// import Menus from "../../public/img/menu.png";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiClient } from "../services/base_api";

const Header = () => {
  const router = useRouter();
  // const onSearch = (value: string) => {
  //   console.log("Search value: ", value);
  // };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.warn("No access token found. Redirecting to login page...");
        router.push("/pages/login");
        return;
      }

      const response = await apiClient.post("/account/log-out", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        localStorage.removeItem("accessToken");

        localStorage.removeItem("key");
        localStorage.removeItem("value");

        localStorage.removeItem("groupSystemId");
        localStorage.removeItem("groupBranchId");
        localStorage.removeItem("groupTeamId");

        localStorage.removeItem("groupSystemName");
        localStorage.removeItem("groupBranchName");
        localStorage.removeItem("groupTeamName");

        router.push("/pages/login");
      } else {
        console.error("Logout failed with status: ", response.status);
      }
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   router.push("/pages/login");
  // };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white flex justify-between px-[30px] h-[70px] header">
      <div className="flex items-center">
        {/* <Image
          src={Menus}
          alt="Menu"
          width={22}
          height={24}
          className="mr-[30px]"
        /> */}
        <div className="search-container">
          {/* <Input
            placeholder="Search"
            onPressEnter={(e) => onSearch(e.currentTarget.value)}
            style={{ width: 388, borderRadius: "30px", height: 38 }}
          /> */}
        </div>
      </div>
      <div className="flex items-center">
        <Avatar size={44} icon={<UserOutlined />} />
        <div className="avatar-info px-5">
          <div className="text-sm font-bold">Admin</div>
          {/* <div className="text-xs font-semibold">Admin</div> */}
        </div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <div
            className="w-[18px] h-[18px] border border-solid border-[#5C5C5C] rounded-full flex items-center justify-center opacity-50 avt cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            <DownOutlined className="w-[6px] h-[4px]" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
