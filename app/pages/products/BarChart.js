// components/BarChart.js
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const data = {
    labels: ['Tổng tiền ra', 'Tổng tiền vào', 'Giao dịch vào', 'Giao dịch ra'],
    datasets: [
      {
        label: 'Tổng tiền ra',
        data: [1000, 0, 0, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
      {
        label: 'Tổng tiền vào',
        data: [0, 2000, 0, 0],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Giao dịch vào',
        data: [0, 0, 500, 0],
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
      },
      {
        label: 'Giao dịch ra',
        data: [0, 0, 0, 1500],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + 'k';
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '400px', height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
