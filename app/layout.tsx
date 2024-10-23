"use client";
import "./globals.css";
import React from "react";
import { Layout } from "antd";
import SideMenu from "./component/Menu";
import { usePathname } from "next/navigation";

const { Content } = Layout;

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const isLoginPage = pathname === "/pages/login";

  return (
    <html lang="en">
      <body>
        <Layout>
          {!isLoginPage && <SideMenu />}
          <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
            {children}
          </Content>
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
