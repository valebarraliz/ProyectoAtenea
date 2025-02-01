import { Bar } from "react-chartjs-2";
import { useEffect, useState, useMemo } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function BarsChart({ data }) {
    const [voteCounts, setVoteCounts] = useState(data.vote_counts);
    const [partyNames, setPartyNames] = useState(data.party_names);
    const maxVotes = useMemo(() => Math.max(...voteCounts), [voteCounts]);

    useEffect(() => {
        const channel = Echo.channel("vote-channel");

        channel.listen("VoteCast", (event) => {
            const updatedVoteCounts = [...voteCounts];
            const partyIndex = partyNames.indexOf(event.partyName);

            if (partyIndex !== -1) {
                updatedVoteCounts[partyIndex] = event.voteCount;
            } else {
                updatedVoteCounts.push(event.voteCount);
                setPartyNames([...partyNames, event.partyName]);
            }
            setVoteCounts(updatedVoteCounts);
        });

        return () => {
            channel.stopListening("VoteCast");
        };
    }, [voteCounts, partyNames]);

    // Paleta de colores pastel para un look más amigable
    const pastelColors = [
        "rgba(255, 99, 132, 0.8)", // Rosa
        "rgba(255, 159, 64, 0.8)", // Naranja
        "rgba(255, 205, 86, 0.8)", // Amarillo
        "rgba(75, 192, 192, 0.8)", // Verde
        "rgba(54, 162, 235, 0.8)", // Azul
        "rgba(153, 102, 255, 0.8)", // Morado
    ];

    const colors = partyNames.map(
        (_, index) => pastelColors[index % pastelColors.length]
    );

    var chartData = {
        labels: partyNames.map((name) => `⭐ ${name}`), // Agrega emoji a los nombres
        datasets: [
            {
                label: "Votos 📊",
                data: voteCounts,
                backgroundColor: colors,
                borderColor: colors.map((color) => color.replace("0.8", "1")), // Bordes más intensos
                borderWidth: 2,
                borderRadius: 10, // Bordes redondeados
            },
        ],
    };

    var options = {
        responsive: true,
        animation: {
            duration: 2000, // Duración más larga para una animación más visible
            easing: "easeOutBounce", // Hace que las barras reboten al aparecer
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(0,0,0,0.7)",
                titleFont: { size: 16 },
                bodyFont: { size: 14 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                stepSize: 1,
                ticks: {
                    font: {
                        size: 14,
                        family: "'Comic Sans MS', cursive, sans-serif", // Fuente divertida
                    },
                    callback: function (value) {
                        return Number.isInteger(value)
                            ? value === maxVotes
                                ? `${value} 🏆`
                                : `${value}`
                            : "";
                    },
                },
            },
            x: {
                ticks: {
                    font: {
                        size: 16,
                        family: "'Comic Sans MS', cursive, sans-serif",
                    },
                },
            },
        },
    };

    return <Bar data={chartData} options={options}></Bar>;
}
