"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { TypeAsset } from "@/src/common/type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChartMoney({
  moneyChart,
}: Readonly<{ moneyChart: TypeAsset[] }>) {
  const listLabelConvert = moneyChart?.map((item2) => {
    return `${item2.key.split(".")[0]}k`;
  });

  const listDataCovert = moneyChart.map((item2) => {
    return Math.abs(item2.value);
  });

  const listBackground = moneyChart.map((item2) => {
    if (item2.key === "1.000") return "#979797";
    if (item2.key === "2.000") return "#FFB759";
    if (item2.key === "5.000") return "#3749A6";
    if (item2.key === "10.000") return "#FFD56D";
    if (item2.key === "20.000") return "#4393FF";
    if (item2.key === "50.000") return "#FF5DA0";
    if (item2.key === "100.000") return "#07C751";
    if (item2.key === "200.000") return "#FF0000";
    if (item2.key === "500.000") return "#44BED3";
  });

  const data = {
    labels: listLabelConvert,
    datasets: [
      {
        data: listDataCovert,
        backgroundColor: listBackground,
        barThickness: 25,
        stack: "Stack 1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Số lượng tờ tiền đã giao dịch",
        color: "#000",
        padding: {
          top: 20,
          bottom: 60,
        },
        font: {
          size: 24,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          padding: 10,
        },
        grid: {
          display: false,
        },
        categoryPercentage: 0.5,
        barPercentage: 0.8,
      },
      y: {
        stacked: true,
        ticks: {
          beginAtZero: true,
          stepSize: 1,
          callback(value: number | string) {
            if (typeof value === "number") {
              return value >= 1e3 ? `${(value / 1e3).toFixed(1)}K` : value;
            }
            return value;
          },
        },
      },
    },
  };

  return (
    <div
      style={{ width: "80%", height: "550px", margin: "0" }}
      className="custom-chart"
    >
      <Bar data={data} options={options} />
    </div>
  );
}
