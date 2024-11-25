"use client";

import Header from "@/src/component/Header";
import { Col, Row } from "antd";
import { useState } from "react";

import { moockAseet } from "./constants";
import { ItemAssetType } from "@/src/common/type";
import CardAseet from "@/src/module/aseetReport";
import BarChart from "../../module/aseetReport/BarChart";
import { TotalIcon } from "../../../public/icon/total";

const AssetPage = () => {
  const [active, setActive] = useState<number>(1);
  const handleClick = (type: number) => {
    console.log("11", type);
    setActive(type);
  };
  return (
    <div>
      <Header />
      {/* <StackedBarChart /> */}
      <Row gutter={[20, 20]}>
        <Col span={4}>
          <div className="flex flex-col gap-7">
            {moockAseet.map((itemAseet: ItemAssetType) => {
              return (
                <CardAseet
                  title={itemAseet.title}
                  quantity={itemAseet.quantity}
                  type={itemAseet.type}
                  key={itemAseet.title}
                  handleClick={handleClick}
                  active={active}
                />
              );
            })}
          </div>
        </Col>
        <Col span={20}>
          <div>
            <Row>
              <Col span={24}>
                <div>
                  <TotalIcon />
                </div>
              </Col>
              <Col span={14}>
                <BarChart />
              </Col>
              <Col span={6}>3</Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AssetPage;
