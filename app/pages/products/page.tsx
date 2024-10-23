"use client"
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: number[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Tổng tiền vào', 'Tổng tiền ra', 'Giao dịch vào', 'Giao dịch ra'],
    datasets: [
      {
        label: 'Giá trị',
        data: data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Tổng tiền vào
          'rgba(255, 99, 132, 0.6)', // Tổng tiền ra
          'rgba(54, 162, 235, 0.6)', // Giao dịch vào
          'rgba(255, 206, 86, 0.6)', // Giao dịch ra
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Biểu đồ giao dịch tài chính',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
