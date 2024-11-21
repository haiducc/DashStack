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
        <Layout className="min-h-screen">
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
      </body>
    </html>
  );
};
export default RootLayout;
