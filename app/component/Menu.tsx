"use client";
import React from "react";
import {
  ClockCircleOutlined,
  DatabaseOutlined,
  HeartOutlined,
  MessageOutlined,
  AndroidFilled,
  SlackSquareOutlined,
  PauseCircleTwoTone
} from "@ant-design/icons";
import { Menu as AntMenu } from "antd";
import Image from "next/image";
import Logo from "../../public/img/logo.png";
import { useRouter } from "next/navigation";

type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  type?: "group" | "divider";
};

const items: MenuItem[] = [
  {
    key: "statistics",
    label: "Thống kê",
    icon: <ClockCircleOutlined />,
    path: "/pages/dashboard",
  },
  {
    key: "account",
    label: "Cấu hình tài khoản",
    icon: <HeartOutlined />,
    children: [
      {
        key: "account_group",
        label: "Nhóm tài khoản",
        path: "/pages/account_group",
      },
      {
        key: "list_account",
        label: "Danh sách tài khoản",
        path: "/pages/account",
      },
      {
        key: "phone",
        label: "Danh sách số điện thoại",
        path: "/pages/phone_number",
      },
    ],
  },
  {
    key: "telegram_seting",
    label: "Cấu hình telegram",
    icon: <AndroidFilled />,
    children: [
      {
        key: "group_telegram",
        label: "Nhóm telegram",
        path: "/pages/telegram",
      },
      {
        key: "telegram_integration",
        label: "Danh sách tích hợp telegram",
        path: "/pages/telegram_integration",
      },
    ],
  },
  {
    key: "sheet_setting",
    label: "Cấu hình trang tính",
    icon: <MessageOutlined />,
    children: [
      {
        key: "group_sheet",
        label: "Nhóm trang tính",
        path: "/pages/sheet",
      },
      {
        key: "sheet_integration",
        label: "Danh sách tích hợp trang tính",
        path: "/pages/sheet_intergration",
      },
    ],
  },
  {
    key: "transaction",
    label: "Giao dịch thủ công",
    icon: <DatabaseOutlined />,
    path: "/pages/transaction",
  },
  {
    key: "role",
    label: "Nhóm quyền tài khoản",
    icon: <SlackSquareOutlined />,
    path: "/pages/role",
  },
  {
    key: "settings",
    label: "Cấu hình hề thống",
    icon: <PauseCircleTwoTone />,
    path: "/pages/settings",
  },
];

const SideMenu = () => {
  const router = useRouter();

  const onClick = (e: { key: string }) => {
    const clickedItem = items
      .flatMap((item) =>
        item.children
          ? [{ ...item, children: undefined }, ...item.children]
          : item
      )
      .find((item) => item.key === e.key);

    if (clickedItem && clickedItem.path) {
      router.push(clickedItem.path);
    }
  };

  return (
    <div style={{ width: 256, backgroundColor: "#4B5CB8" }}>
      <Image
        alt="Logo"
        src={Logo}
        style={{
          width: "70%",
          height: "auto",
          marginBottom: "20px",
          margin: "auto",
          padding: "20px 0",
        }}
      />
      <AntMenu
        onClick={onClick}
        style={{
          backgroundColor: "#4B5CB8",
          borderRight: 0,
          color: "#fff",
        }}
        mode="inline"
      >
        {items.map(({ key, label, icon, children }) => {
          if (children && children.length > 0) {
            return (
              <AntMenu.SubMenu key={key} icon={icon} title={label}>
                {children.map((child) => (
                  <AntMenu.Item key={child.key}>{child.label}</AntMenu.Item>
                ))}
              </AntMenu.SubMenu>
            );
          }
          return (
            <AntMenu.Item key={key} icon={icon}>
              {label}
            </AntMenu.Item>
          );
        })}
      </AntMenu>
    </div>
  );
};

export default SideMenu;
