"use client";

import "./globals.css";
import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideMenu from "../component/Menu";
import NextTopLoader from "nextjs-toploader";

const { Content } = Layout;

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchRoleData(accessToken);
    }
  }, [accessToken]);

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Layout className="min-h-screen">
            <NextTopLoader color="#2299DD" height={3} speed={400} />
            {!isLoginPage ? (
              <div className="grid grid-cols-12 min-h-screen">
                {/* SideMenu: Col 2 with sticky behavior */}
                <div className="col-span-2 bg-gray-100 h-screen sticky top-0">
                  <SideMenu />
                </div>

                {/* Content: Col 10 */}
                <div className="col-span-10">
                  <Content>{children}</Content>
                </div>
              </div>
            ) : (
              // Full width content for Login Page
              <div className="flex items-center justify-center min-h-screen">
                <Content>{children}</Content>
              </div>
            )}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
};
export default RootLayout;
