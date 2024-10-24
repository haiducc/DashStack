"use client";
import React from "react";
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  HeartOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Menu as AntMenu } from "antd";
import Image from "next/image";
import Logo from "../../public/img/logo.png";

type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: "group" | "divider";
};

const items: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <ClockCircleOutlined />,
  },
  {
    key: "products",
    label: "Products",
    icon: <AppstoreOutlined />,
  },
  {
    key: "favourites",
    label: "Favourites",
    icon: <HeartOutlined />,
  },
  {
    key: "messenger",
    label: "Messenger",
    icon: <MessageOutlined />,
  },
  {
    key: "Products Stock",
    label: "Products Stock",
    icon: <DatabaseOutlined />,
  },
];

const SideMenu = () => {
  const onClick = (e: unknown) => {
    console.log("click ", e);
  };

  return (
    <div style={{ width: 256, backgroundColor: "#4B5CB8"}}>
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items={items as any}
      />
    </div>
  );
};

export default SideMenu;
