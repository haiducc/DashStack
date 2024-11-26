// components/BarChart.js
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
import { getDataGenaral } from "@/src/services/statistics";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface filterRole {
  Name: string;
  Value: string;
}

const BarChart = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataChart, setDataChart] = useState<any | null>(null);
  const [keys, setKeys] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<string | null>(null);

  useEffect(() => {
    setKeys(localStorage.getItem("key"));
    setValues(localStorage.getItem("value"));
  }, []);

  const fetchDataGenaral = async () => {
    const arrRole: filterRole[] = [];
    const addedParams = new Set<string>();
    arrRole.push({
      Name: localStorage.getItem("key")!,
      Value: localStorage.getItem("value")!,
    });
    addedParams.add(keys!);
    try {
      const response = await getDataGenaral(1, 20, undefined, arrRole);
      // console.log(response, "data chart");
      if (response.data) {
        const {
          totalAmountOut,
          totalAmountIn,
          // countTransactionOut,
          // countTransactionIn,
        } = response.data;

        const data = {
          labels: [
            "Tổng tiền ra",
            "Tổng tiền vào",
            // "Giao dịch ra",
            // "Giao dịch vào",
          ],
          datasets: [
            {
              label: "Tổng tiền ra",
              data: [totalAmountOut, 0, 0, 0],
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
            {
              label: "Tổng tiền vào",
              data: [0, totalAmountIn, 0, 0],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            // {
            //   label: "Giao dịch ra",
            //   data: [0, 0, countTransactionOut, 0], 
            //   backgroundColor: "rgba(255, 206, 86, 0.2)",
            //   borderColor: "rgba(255, 206, 86, 1)",
            //   borderWidth: 1,
            // },
            // {
            //   label: "Giao dịch vào",
            //   data: [0, 0, 0, countTransactionIn],
            //   backgroundColor: "rgba(54, 162, 235, 0.2)",
            //   borderColor: "rgba(54, 162, 235, 1)",
            //   borderWidth: 1,
            // },
          ],
        };
        setDataChart(data);
      } else {
        console.error("Data is not valid");
      }
    } catch (error) {
      console.error("Lỗi r:", error);
    }
  };

  useEffect(() => {
    fetchDataGenaral();
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function (value: any) {
            return value + "k";
          },
        },
      },
    },
  };

  return (
    <div>
      {dataChart ? (
        <Bar data={dataChart} options={options} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BarChart;
