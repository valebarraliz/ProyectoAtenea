import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

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
    const [voteCounts, setVoteCounts] = useState(data.vote_counts);
    const [partyNames, setPartyNames] = useState(data.party_names);

    useEffect(() => {
        const channel = Echo.channel("vote-channel");

        channel.listen("VoteCast", (event) => {
            const updatedVoteCounts = [...voteCounts];
            const partyIndex = partyNames.indexOf(event.partyName);

            if (partyIndex !== -1) {
                updatedVoteCounts[partyIndex] = event.voteCount;
            }else{
                updatedVoteCounts.push(event.voteCount);
                const updatedPartyNames = [...partyNames];
                updatedPartyNames.push(event.partyName);
                setPartyNames(updatedPartyNames);
            }
            setVoteCounts(updatedVoteCounts);
        });

        return () => {
            channel.stopListening("VoteCast");
        };
    }, [voteCounts, partyNames]);

    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r},${g},${b},0.5)`;
    };

    const colors = partyNames.map(() => getRandomColor());

    var chartData = {
        labels: partyNames,
        datasets: [
            {
                label: "Votos",
                data: voteCounts,
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
                    callback: function (value) {
                        return Number.isInteger(value) ? value : ""; // Mostrar solo enteros
                    },
                },
            },
        },
    };
    return <Bar data={chartData} options={options}></Bar>;
}
