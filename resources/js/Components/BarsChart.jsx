import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function BarsChart({ data }) {
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r},${g},${b},0.5)`;
    };

    const colors = data.party_names.map(() => getRandomColor());

    var chartData = {
        labels: data.party_names,
        datasets: [
            {
                label: "Votos",
                data: data.vote_counts,
                backgroundColor: colors,
            },
        ],
    };
    var options = {
        responsive: true,
        animation: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value) {
                        return Number.isInteger(value) ? value : ''; // Mostrar solo enteros
                    },
                },
            },
        },
    };
    return <Bar data={chartData} options={options}></Bar>;
}
