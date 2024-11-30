"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useGlobal } from "@/context/globalContext";
import Card from "@/components/ui/card";
import { TooltipItem } from "chart.js";
import TooltipComponent from "@/components/Tooltip";

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
		maintainAspectRatio: true,
		aspectRatio: 2.5,
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
			tooltip: {
				callbacks: {
					label: (context: TooltipItem<"bar">) => {
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
		<Card>
			<div className="horizontal items-center gap-2">
				<h2 className="font-semibold text-sm uppercase tracking-widest">Region Performance</h2>
				<TooltipComponent>
					<div className="vertical text-xs text-gray-600 gap-1">
						<p className="font-semibold">How to read this chart:</p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Green bars show successful resource allocations</li>
							<li>Red bars show failed allocations</li>
							<li>Taller total bars indicate more attempts in that region</li>
							<li>Higher green-to-red ratio indicates better performance</li>
						</ul>
					</div>
				</TooltipComponent>
			</div>
			<Bar data={data} options={options} />
		</Card>
	);
}
