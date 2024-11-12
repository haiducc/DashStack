"use client";

import "./globals.css";
import React from "react";
import { Layout } from "antd";
import SideMenu from "./component/Menu";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Content } = Layout;

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/pages/login";

  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: "100vh" }}>
          <div className="flex">
            {!isLoginPage && <SideMenu />}
            <Content
              style={{
                padding: "0 50px",
                minHeight: "100vh",
                flexGrow: 1,
              }}
            >
              {children}
            </Content>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Layout>
      </body>
    </html>
  );
};
export default RootLayout;
