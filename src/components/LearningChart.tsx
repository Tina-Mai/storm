"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ScatterController } from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { useGlobal } from "@/context/globalContext";
import { TooltipItem } from "chart.js";
import Card from "@/components/ui/card";
import TooltipComponent from "@/components/Tooltip";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ScatterController);

export default function LearningChart() {
	const { rewardHistory } = useGlobal();

	// Calculate moving average
	const windowSize = 10;
	const movingAverage = rewardHistory.map((_, index) => {
		const start = Math.max(0, index - windowSize + 1);
		const window = rewardHistory.slice(start, index + 1);
		return window.reduce((sum, val) => sum + val, 0) / window.length;
	});

	// Calculate success rate over time
	const cumulativeSuccessRate = rewardHistory.map((_, index) => {
		const window = rewardHistory.slice(0, index + 1);
		return window.reduce((sum, val) => sum + val, 0) / (index + 1);
	});

	const data: ChartData<"line"> = {
		labels: rewardHistory.map((_, index) => `${index + 1}`),
		datasets: [
			{
				type: "line",
				label: "Individual Attempts",
				data: rewardHistory,
				borderColor: "rgba(156, 163, 175, 0.5)",
				backgroundColor: "rgba(156, 163, 175, 0.5)",
				borderWidth: 1,
				pointRadius: 2,
				showLine: false,
			},
			{
				type: "line",
				label: "Recent Success Rate",
				data: movingAverage,
				borderColor: "rgb(75, 192, 192)",
				backgroundColor: "rgba(75, 192, 192, 0.1)",
				fill: true,
				tension: 0.4,
			},
			{
				type: "line",
				label: "Overall Success Rate",
				data: cumulativeSuccessRate,
				borderColor: "rgb(255, 99, 132)",
				borderDash: [5, 5],
				tension: 0.4,
				pointRadius: 0,
			},
		],
	};

	const options: ChartOptions<"line"> = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			tooltip: {
				callbacks: {
					label: (context: TooltipItem<"line">) => {
						const value = context.parsed.y;
						const label = context.dataset.label;
						return `${label}: ${(value * 100).toFixed(1)}% success rate`;
					},
				},
			},
		},
		scales: {
			y: {
				type: "linear",
				min: 0,
				max: 1,
				title: {
					display: true,
					text: "Success Rate",
				},
				ticks: {
					callback: (value) => `${(Number(value) * 100).toFixed(0)}%`,
				},
			},
			x: {
				type: "linear",
				title: {
					display: true,
					text: "Attempt Number",
				},
				ticks: {
					maxTicksLimit: 10,
				},
			},
		},
	};

	return (
		<Card>
			<div className="horizontal items-center gap-2">
				<h2 className="font-semibold text-sm uppercase tracking-widest">Learning Progress</h2>
				<TooltipComponent>
					<div className="vertical text-xs text-gray-600 gap-1">
						<p className="font-semibold">How to read this chart:</p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Gray dots show individual successes (1) and failures (0)</li>
							<li>Green line shows recent performance (moving average)</li>
							<li>Red dashed line shows overall success rate</li>
							<li>Upward trends indicate the algorithm is learning</li>
						</ul>
					</div>
				</TooltipComponent>
			</div>
			<Line data={data} options={options} />
		</Card>
	);
}