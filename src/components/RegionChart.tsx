"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Region } from "@/types/simulation";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RegionChartProps {
	regions: Region[];
}

export default function RegionChart({ regions }: RegionChartProps) {
	const data = {
		labels: regions.map((r) => r.name),
		datasets: [
			{
				label: "Demand",
				data: regions.map((r) => r.demand),
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
			{
				label: "Allocated",
				data: regions.map((r) => r.allocated),
				backgroundColor: "rgba(75, 192, 192, 0.5)",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: "Region Resource Distribution",
			},
		},
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<Bar data={data} options={options} />
		</div>
	);
}
