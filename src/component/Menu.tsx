"use client";
import React, { useEffect, useState } from "react";
import { Menu as AntMenu } from "antd";
import Image from "next/image";
import Logo from "../../public/img/logo.png";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "./menu.css";

type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  items?: MenuItem[];
  type?: "group" | "divider";
};

const items: MenuItem[] = [
  {
    key: "statistics",
    label: "Thống kê",
    path: "/dashboard",
  },
  {
    key: "system_configuration",
    label: "Cấu hình hệ thống",
    items: [
      {
        key: "group_system",
        label: "Danh sách hệ thống",
        path: "/group_system",
      },
      {
        key: "group_branch",
        label: "Danh sách chi nhánh",
        path: "/group_branch",
      },
      {
        key: "group_team",
        label: "Danh sách đội nhóm",
        path: "/group_team",
      },
    ],
  },
  {
    key: "account",
    label: "Cấu hình tài khoản",
    items: [
      {
        key: "account_group",
        label: "Nhóm tài khoản",
        path: "/account_group",
      },
      {
        key: "phone",
        label: "Danh sách số điện thoại",
        path: "/phone_number",
      },
      {
        key: "list_account",
        label: "Danh sách tài khoản",
        path: "/account",
      },
    ],
  },
  {
    key: "telegram_seting",
    label: "Cấu hình telegram",
    items: [
      {
        key: "group_telegram",
        label: "Nhóm telegram",
        path: "/telegram",
      },
      {
        key: "telegram_integration",
        label: "Danh sách tích hợp telegram",
        path: "/telegram_integration",
      },
    ],
  },
  {
    key: "sheet_setting",
    label: "Cấu hình trang tính",
    items: [
      {
        key: "group_sheet",
        label: "Nhóm trang tính",
        path: "/sheet",
      },
      {
        key: "sheet_integration",
        label: "Danh sách tích hợp trang tính",
        path: "/sheet_intergration",
      },
    ],
  },
  {
    key: "transaction",
    label: "Giao dịch thủ công",
    path: "/transaction",
  },
  {
    key: "asset-management",
    label: "Quản lý tài sản",
    items: [
      // {
      //   key: "asset_report",
      //   label: "Báo cáo quản lý tài sản",
      //   path: "/pages/asset-report",
      // },
      {
        key: "list_transaction",
        label: "Danh sách giao dịch",
        path: "/list-transaction",
      },
    ],
  },
  {
    key: "role",
    label: "Quyền tài khoản",
    path: "/role",
  },
  {
    key: "settings",
    label: "Cấu hình hệ thống",
    path: "/settings",
  },
];

const fetchRoleData = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://apiweb.bankings.vnrsoftware.vn/account/find-role-by-account",
      {
        method: "GET",
        headers: {
          Authorization: accessToken,
        },
      }
    );

    const res = await response.json();

    localStorage.setItem("key", res.data.key);
    localStorage.setItem("value", res.data.value);

    localStorage.setItem("groupSystemId", res.data.groupSystemId || "");
    localStorage.setItem("groupBranchId", res.data.groupBranchId || "");
    localStorage.setItem("groupTeamId", res.data.groupTeamId || "");

    localStorage.setItem("groupSystemName", res.data.groupSystemName || " ");
    localStorage.setItem("groupBranchName", res.data.groupBranchName || " ");
    localStorage.setItem("groupTeamName", res.data.groupTeamName || " ");

    if (!response.ok) {
      throw new Error("Failed to fetch role data");
    }

    return res;
  } catch (error) {
    console.error("Error fetching role data:", error);
    return null;
  }
};

const SideMenu = () => {
  const router = useRouter();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchRoleData(accessToken).then((data) => {
        if (data) {
          console.log("Role data fetched:", data);
        }
      });
    }
  }, []);

  const handleMenuClick = async (menuItem: MenuItem) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Vui lòng đăng nhập.");
      router.push("/login");
      return;
    }

    try {
      const roleData = await fetchRoleData(accessToken);
      if (roleData) {
        console.log(roleData, "Role data");
        if (menuItem.path) {
          router.push(menuItem.path);
        }
      } else {
        toast.error("Không thể xác minh quyền của bạn.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Lỗi khi kiểm tra quyền truy cập.");
    }
  };

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys([]);
    }
  };

  const renderMenuItems = (items: MenuItem[]) =>
    items.map((item) =>
      item.items ? (
        <AntMenu.SubMenu key={item.key} title={item.label} icon={item.icon}>
          {renderMenuItems(item.items)}
        </AntMenu.SubMenu>
      ) : (
        <AntMenu.Item
          key={item.key}
          onClick={() => handleMenuClick(item)}
          icon={item.icon}
        >
          {item.label}
        </AntMenu.Item>
      )
    );

  return (
    <div className="side-menu">
      <div className="logo-container">
        <Image src={Logo} alt="Logo" width={100} height={40} />
      </div>
      <AntMenu
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        {renderMenuItems(items)}
      </AntMenu>
    </div>
  );
};

export default SideMenu;
