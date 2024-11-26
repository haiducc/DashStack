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
import { getDataGenaral } from '@/src/services/statistics';
import { useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChartType = () => {
    const [dataChart, setDataChart] = useState(null);

    const fetchDataGenaral = async () => {
        try {
            const response = await getDataGenaral(1, 20);
            console.log(response, "data chart type");
            if (response.data) {
                const {
                    countTransactionOut,
                    countTransactionIn
                } = response.data;

                const data = {
                    labels: ['Giao dịch tiền ra', 'Giao dịch tiền vào'],
                    datasets: [
                        {
                            label: 'Giao dịch tiền ra',
                            data: [countTransactionOut, 0],
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Giao dịch tiền vào',
                            data: [0, countTransactionIn],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
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
                    callback: function (value) {
                        return value + 'k';
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

export default BarChartType;
