"use client";
import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import BaseModal from "@/app/component/config/BaseModal";
import { Table } from "antd";
import {
  getDataGenaral,
  getDetailCurentBalance,
} from "@/app/services/statistics";

const Statistics = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataDetailCurentBalance, setDataDetailCurentBalance] = useState([]);
  const [databalance, setDataBalance] = useState();
  const [dataTotalAmount, setDataTotalAmount] = useState();

  const fetchDataGenaral = async () => {
    try {
      const res = await getDataGenaral(1, 20);
      // console.log("Response:", res);
      if (
        res &&
        res.data &&
        res.data.balance !== undefined &&
        res.data.totalAmount !== undefined
      ) {
        setDataBalance(res.data.balance);
        setDataTotalAmount(res.data.totalAmount);
      } else {
        console.warn("Balance or Total Amount is missing in the response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataGenaral();
  }, []);

  const fetchListStatistics = async () => {
    try {
      const response = await getDetailCurentBalance(1, 20);
      const formattedData =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response?.source?.map((x: any) => ({
          id: x.id,
          bankName: x.bankName,
          bankAccount: x.bankAccount,
          fullName: x.fullName,
          currentBalance: x.currentBalance,
        })) || [];
      setDataDetailCurentBalance(formattedData);
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
    }
  };

  const columns = [
    { title: "id", dataIndex: "id", key: "id", hidden: true },
    { title: "Ngân hàng", dataIndex: "bankName", key: "bankName" },
    {
      title: "Tài khoản ngân hàng",
      dataIndex: "bankAccount",
      key: "bankAccount",
    },
    { title: "Chủ tài khoản", dataIndex: "fullName", key: "fullName" },
    {
      title: "Số dư",
      dataIndex: "currentBalance",
      key: "currentBalance",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (amount: any) => new Intl.NumberFormat("vi-VN").format(amount),
    },
  ];

  const showModal = async () => {
    await fetchListStatistics();
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "end",
      }}
    >
      <div
        style={statBoxStyle}
        className="flex justify-center flex-col items-center"
      >
        <h3 className="font-bold text-lg">Lợi Nhuận</h3>
        <h1 className="font-bold text-3xl">
          {dataTotalAmount !== undefined
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(dataTotalAmount)
            : "0 ₫"}
        </h1>
      </div>
      <div
        style={statBoxStyles}
        className="flex justify-center flex-col items-center relative"
      >
        <h3 className="font-bold text-lg">Số Dư Hiện Tại</h3>
        <h1 className="font-bold text-3xl">
          {databalance !== undefined
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(databalance)
            : "0 ₫"}
        </h1>

        <div className="absolute right-2 top-2">
          <ExclamationCircleOutlined onClick={showModal} />
        </div>
        <BaseModal
          title="Chi tiết số dư hiện tại"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          offPadding
        >
          <Table columns={columns} dataSource={dataDetailCurentBalance} />
        </BaseModal>
      </div>
    </div>
  );
};

const statBoxStyle = {
  backgroundColor: "#67B173",
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  width: "70%",
  height: "120px",
};

const statBoxStyles = {
  backgroundColor: "#8667B1",
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  width: "70%",
  height: "120px",
};

export default Statistics;
