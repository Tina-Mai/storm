"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useGlobal } from "@/context/globalContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RegionChart() {
	const { regions } = useGlobal();

	const data = {
		labels: regions.map((r) => r.name),
		datasets: [
			{
				label: "Successes",
				data: regions.map((r) => r.successCount),
				backgroundColor: "rgba(75, 192, 192, 0.5)",
			},
			{
				label: "Failures",
				data: regions.map((r) => r.totalAttempts - r.successCount),
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};

	const options = {
		responsive: true,
		scales: {
			x: {
				stacked: true,
				title: {
					display: true,
					text: "Regions",
				},
			},
			y: {
				stacked: true,
				beginAtZero: true,
				title: {
					display: true,
					text: "Number of Attempts",
				},
			},
		},
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: "Region Performance",
			},
			tooltip: {
				callbacks: {
					label: (context: any) => {
						const region = regions[context.dataIndex];
						const value = context.parsed.y;
						const successRate = ((region.successCount / (region.totalAttempts || 1)) * 100).toFixed(1);

						return [`${context.dataset.label}: ${value}`, `Success Rate: ${successRate}%`, `True Effectiveness: ${(region.hiddenEffectiveness * 100).toFixed(1)}%`];
					},
				},
			},
		},
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<Bar data={data} options={options} />
			<div className="mt-4 text-sm text-gray-600">
				<p>
					<strong>How to read this chart:</strong>
				</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Green bars show successful resource allocations</li>
					<li>Red bars show failed allocations</li>
					<li>Taller total bars indicate more attempts in that region</li>
					<li>Higher green-to-red ratio indicates better performance</li>
				</ul>
			</div>
		</div>
	);
}
