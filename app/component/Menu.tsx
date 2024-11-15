"use client";
import React, { useEffect } from "react";
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
    path: "/pages/dashboard",
  },
  {
    key: "account",
    label: "Cấu hình tài khoản",
    items: [
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
    items: [
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
    items: [
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
    path: "/pages/transaction",
  },
  {
    key: "role",
    label: "Nhóm quyền tài khoản",
    path: "/pages/role",
  },
  {
    key: "settings",
    label: "Cấu hình hệ thống",
    path: "/pages/settings",
  },
];

// Hàm gọi API để lấy quyền của tài khoản
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

    if (!response.ok) {
      throw new Error("Failed to fetch role data");
    }

    return res;
  } catch (error) {
    console.error("Error fetching role data:", error);
    return null;
  }
};

// const SideMenu = () => {
//   const router = useRouter();

//   const onClick = async (e: { key: string }) => {
//     const clickedItem = items
//       .flatMap((item) =>
//         item.items ? [{ ...item, children: undefined }, ...item.items] : item
//       )
//       .find((item) => item.key === e.key);

//     if (clickedItem && clickedItem.path) {
//       const accessToken = await localStorage.getItem("accessToken");
//       // console.log(localStorage.getItem("accessToken"), "accessToken");

//       if (accessToken) {
//         const roleData = await fetchRoleData(accessToken);
//         console.log("accessToken", accessToken);

//         if (roleData) {
//           if (roleData.roles) {
//             router.push(clickedItem.path);
//           } else {
//             toast.error("Bạn không có quyền truy cập vào trang này.");
//           }
//         } else {
//           toast.error("Không thể xác minh quyền của bạn.");
//         }
//       } else {
//         toast.error("Vui lòng đăng nhập.");
//         router.push("/pages/login");
//       }
//     }
//   };

//   return (
//     <div style={{ width: 256, backgroundColor: "#4B5CB8" }}>
//       <Image
//         alt="Logo"
//         src={Logo}
//         style={{
//           width: "70%",
//           height: "auto",
//           marginBottom: "20px",
//           margin: "auto",
//           padding: "20px 0",
//         }}
//       />
//       <AntMenu
//         onClick={onClick}
//         style={{
//           backgroundColor: "#4B5CB8",
//           borderRight: 0,
//           color: "#fff",
//         }}
//         mode="inline"
//       >
//         {items.map(({ key, label, icon, items }) => {
//           if (items && items.length > 0) {
//             return (
//               <AntMenu.SubMenu key={key} icon={icon} title={label}>
//                 {items.map((child) => (
//                   <AntMenu.Item key={child.key}>{child.label}</AntMenu.Item>
//                 ))}
//               </AntMenu.SubMenu>
//             );
//           }
//           return (
//             <AntMenu.Item key={key} icon={icon}>
//               {label}
//             </AntMenu.Item>
//           );
//         })}
//       </AntMenu>
//     </div>
//   );
// };

const SideMenu = () => {
  const router = useRouter();

  useEffect(() => {
    // console.log("useEffect is running");
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
      router.push("/pages/login");
      return;
    }

    try {
      const roleData = await fetchRoleData(accessToken);
      if (roleData) {
        console.log(roleData, "Role data");

        // Kiểm tra quyền truy cập
        if (roleData.data.isAdmin || roleData.data.value === 1) {
          // Điều hướng nếu có quyền
          if (menuItem.path) {
            router.push(menuItem.path);
            // toast.info(`Đang chuyển đến ${menuItem.label}`);
          }
        } else {
          toast.error("Bạn không có quyền truy cập vào trang này.");
        }
      } else {
        toast.error("Không thể xác minh quyền của bạn.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Lỗi khi kiểm tra quyền truy cập.");
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
      <AntMenu mode="inline" theme="dark">
        {renderMenuItems(items)}
      </AntMenu>
    </div>
  );
};

export default SideMenu;
