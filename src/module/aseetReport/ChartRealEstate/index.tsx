import { Col, Row } from "antd";
import React from "react";
import BarChart from "./BarChart";
import { TypeAsset } from "@/src/common/type";
import ProgressRealEstate from "./ProgressRealEstate";

const ChartRealEstate = ({
  realEstate,
  handleChangeMonthProgress,
  progress,
}: {
  realEstate: TypeAsset[];
  progress: TypeAsset[] | null;
  handleChangeMonthProgress: (e: number) => void;
}) => {
  const listRealEstateChart = realEstate?.filter(
    (item: TypeAsset) => item.value !== 0
  );

  return (
    <Row>
      <Col span={16}>
        {listRealEstateChart.length > 0 ? (
          <BarChart realEstate={listRealEstateChart} />
        ) : (
          <p className="text-base text-center italic pt-20">
            Không có dữ liệu!
          </p>
        )}
      </Col>
      <Col span={8}>
        <ProgressRealEstate
          handleChangeMonthProgress={handleChangeMonthProgress}
          progress={progress}
        />
      </Col>
    </Row>
  );
};

export default ChartRealEstate;
