import { Col, Row } from "antd";
import React from "react";
import BarChart from "./BarChart";
import ProgressMoney from "./ProgressMoney";
import { TypeAsset } from "@/src/common/type";

const ChartMoney = ({
  moneyChart,
  handleChangeMonthProgress,
  progress,
}: {
  moneyChart: TypeAsset[];
  progress: TypeAsset[] | null;
  handleChangeMonthProgress: (e: number) => void;
}) => {
  const listMoneyChart = moneyChart?.filter(
    (item: TypeAsset) => item.value !== 0
  );

  return (
    <Row>
      <Col span={16}>
        {listMoneyChart.length > 0 ? (
          <BarChart moneyChart={listMoneyChart} />
        ) : (
          <p className="text-base text-center italic pt-20">
            Không có dữ liệu!
          </p>
        )}
      </Col>
      <Col span={8}>
        <ProgressMoney
          handleChangeMonthProgress={handleChangeMonthProgress}
          progress={progress}
        />
      </Col>
    </Row>
  );
};

export default ChartMoney;
