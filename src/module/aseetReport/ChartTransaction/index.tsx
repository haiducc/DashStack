import { Col, Row } from "antd";
import React from "react";
import BarChart from "./BarChart";
import { TransactionType } from "@/src/common/type";

const ChartTransaction = ({
  transaction,
}: {
  transaction: TransactionType[];
}) => {
  const totalAmountIn = transaction.reduce((sum, item) => {
    return sum + item.totalAmountIn;
  }, 0);

  const totalAmountOut = transaction.reduce((sum, item) => {
    return sum + item.totalAmountOut;
  }, 0);

  const totalBalance = transaction.reduce((sum, item) => {
    return sum + item.balance;
  }, 0);

  return (
    <Row>
      <Col span={16}>
        {transaction.length > 0 ? (
          <BarChart transaction={transaction} />
        ) : (
          <p className="text-base text-center italic pt-20">
            Không có dữ liệu!
          </p>
        )}
      </Col>
      <Col span={8}>
        <div className="bg-white px-4 py-10 rounded-lg flex flex-col gap-4">
          <p className="uppcase text-2xl font-bold">Tổng</p>
          <ul className="flex flex-col gap-4 pl-3">
            <li>
              <p>
                <span className="inline-block w-[100px] text-base">
                  Tiền vào:
                </span>
                <span className="font-semibold w-[100px] text-base">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmountIn)}
                </span>
              </p>
            </li>
            <li>
              <p>
                <span className="inline-block w-[100px] text-base">
                  Tiền ra:
                </span>
                <span className="font-semibold w-[100px] text-base">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmountOut)}
                </span>
              </p>
            </li>
            <li>
              <p>
                <span className="inline-block w-[100px] text-base">Số dư:</span>
                <span className="font-semibold w-[100px] text-base">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalBalance)}
                </span>
              </p>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  );
};

export default ChartTransaction;
