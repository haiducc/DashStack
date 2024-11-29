import { Col, Row } from "antd";
import React from "react";
import BarChart from "./BarChart";
import ProgressGold from "./ProgressGold";
import { TypeAsset } from "@/src/common/type";

const ChartGold = ({
  goldChart,
  handleChangeMonthProgress,
  progress,
}: {
  goldChart: TypeAsset[];
  progress: TypeAsset[] | null;
  handleChangeMonthProgress: (e: number, typeChart: string) => void;
}) => {
  const listGoldChart = goldChart?.filter(
    (item: TypeAsset) => item.value !== 0
  );

  return (
    <Row>
      <Col span={16}>
        {listGoldChart.length > 0 ? (
          <BarChart goldChart={listGoldChart} />
        ) : (
          <p className="text-base text-center italic pt-20">
            Không có dữ liệu!
          </p>
        )}
      </Col>
      <Col span={8}>
        <ProgressGold
          handleChangeMonthProgress={handleChangeMonthProgress}
          progress={progress}
        />
      </Col>
    </Row>
  );
};

export default ChartGold;
