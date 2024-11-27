/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeAsset } from "@/src/common/type";
import { Progress, Select } from "antd";
import React from "react";
import { options } from "../constants";

const ProgressGold = ({
  progress,
  handleChangeMonthProgress,
}: {
  progress: TypeAsset[] | null;
  handleChangeMonthProgress: (e: number) => void;
}) => {
  let listMoneyPercentage: any[] = [];
  if (progress) {
    const totalGold = progress.reduce((sum, item) => {
      return sum + Math.abs(item.value);
    }, 0);
    if (totalGold) {
      listMoneyPercentage = progress.map((item) => {
        const percentage = (Math.abs(item.value) / totalGold) * 100;
        const color = () => {
          if (item.key === "Vàng nhẫn") return "#4393FF";
          if (item.key === "Vàng thỏi") return "#FFB759";
          if (item.key === "Dây chuyền") return "#D499FF";
        };

        return {
          key: item.key,
          percentage: parseFloat(percentage.toFixed(2)),
          color: color(),
          title: item.key,
        };
      });
    }
  }

  return (
    <div className="bg-white px-4 py-10 rounded-lg flex flex-col gap-4">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold">Đã giao dịch</span>
        <Select
          placeholder="Tháng"
          allowClear
          options={options}
          className="w-[120px]"
          onChange={(e) => handleChangeMonthProgress(e)}
        />
      </div>
      {listMoneyPercentage.length > 0 ? (
        listMoneyPercentage?.map((item) => {
          if (item.percentage === 0) return null;
          return (
            <div key={item.key}>
              <div className="flex justify-between">
                <p>{item.title}</p>
                <span>{`${item.percentage}%`}</span>
              </div>
              <Progress
                percent={item.percentage}
                strokeColor={item.color}
                showInfo={false}
                className="pt-2 aseet-progress"
              />
            </div>
          );
        })
      ) : (
        <p className="text-base text-center italic">Không có dữ liệu!</p>
      )}
    </div>
  );
};

export default ProgressGold;
