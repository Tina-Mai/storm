"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface RewardTrendChartProps {
	rewardHistory: number[];
}

export default function RewardTrendChart({ rewardHistory }: RewardTrendChartProps) {
	const data = {
		labels: rewardHistory.map((_, index) => `Round ${index + 1}`),
		datasets: [
			{
				label: "Reward",
				data: rewardHistory,
				borderColor: "rgb(75, 192, 192)",
				backgroundColor: "rgba(75, 192, 192, 0.5)",
				tension: 0.1,
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
				text: "Reward History",
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				max: 1,
				title: {
					display: true,
					text: "Reward",
				},
			},
		},
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<Line data={data} options={options} />
		</div>
	);
}
