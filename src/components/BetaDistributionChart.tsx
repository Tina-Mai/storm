"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { useGlobal } from "@/context/globalContext";
import Card from "@/components/ui/card";
import { TooltipItem } from "chart.js";
import TooltipComponent from "@/components/Tooltip";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const REGION_COLORS = [
	{ border: "rgb(100, 102, 241)", background: "rgba(100, 102, 241, 0.1)" }, // Indigo
	{ border: "rgb(126, 217, 87)", background: "rgba(126, 217, 87, 0.1)" }, // Green
	{ border: "rgb(54, 162, 235)", background: "rgba(54, 162, 235, 0.1)" }, // Blue
	{ border: "rgb(217, 70, 239)", background: "rgba(217, 70, 239, 0.1)" }, // Fuschia
	{ border: "rgb(255, 159, 64)", background: "rgba(255, 159, 64, 0.1)" }, // Orange
	{ border: "rgb(255, 99, 132)", background: "rgba(255, 99, 132, 0.1)" }, // Rose
	{ border: "rgb(75, 192, 192)", background: "rgba(75, 192, 192, 0.1)" }, // Teal
	{ border: "rgb(255, 205, 86)", background: "rgba(255, 205, 86, 0.1)" }, // Yellow
	{ border: "rgb(244, 114, 182)", background: "rgba(244, 114, 182, 0.1)" }, // Pink
	{ border: "rgb(201, 203, 207)", background: "rgba(201, 203, 207, 0.1)" }, // Gray
];

export default function BetaDistributionChart() {
	const { regions } = useGlobal();

	const xValues = Array.from({ length: 100 }, (_, i) => i / 100);

	const betaPDF = (x: number, alpha: number, beta: number) => {
		const B = Math.exp(lnGamma(alpha) + lnGamma(beta) - lnGamma(alpha + beta));
		return (x ** (alpha - 1) * (1 - x) ** (beta - 1)) / B;
	};

	const lnGamma = (z: number) => {
		const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
		let sum = 1.000000000190015;
		for (let i = 0; i < 6; i++) {
			sum += c[i] / (z + i + 1);
		}
		return (z + 0.5) * Math.log(z + 5.5) - (z + 5.5) + Math.log((2.5066282746310005 * sum) / z);
	};

	const data: ChartData<"line"> = {
		labels: xValues,
		datasets: regions.map((region, index) => ({
			type: "line" as const,
			label: `${region.name}`,
			data: xValues.map((x) => betaPDF(x, region.alpha, region.beta)),
			borderColor: REGION_COLORS[index % REGION_COLORS.length].border,
			backgroundColor: REGION_COLORS[index % REGION_COLORS.length].background,
			fill: true,
			id: region.id.toString(),
			order: region.id,
		})),
	};

	const options: ChartOptions<"line"> = {
		responsive: true,
		maintainAspectRatio: true,
		aspectRatio: 1.8,
		animation: {
			duration: 750,
		},
		plugins: {
			legend: {
				position: "top",
			},
			tooltip: {
				callbacks: {
					label: (context: TooltipItem<"line">) => {
						const region = regions[context.datasetIndex];
						const expectedValue = region.alpha / (region.alpha + region.beta);
						return [
							`${region.name} (α=${region.alpha.toFixed(1)}, β=${region.beta.toFixed(1)})`,
							`Success Rate: ${(expectedValue * 100).toFixed(1)}%`,
							`Confidence: ${(region.alpha + region.beta).toFixed(1)} observations`,
						];
					},
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: "Probability Density",
				},
			},
			x: {
				title: {
					display: true,
					text: "Success Probability",
				},
			},
		},
	};

	return (
		<Card>
			<div className="vertical gap-1 -mb-1">
				<div className="horizontal items-center gap-2">
					<h2 className="font-semibold text-sm uppercase tracking-widest">Beta Distributions by Region</h2>
					<TooltipComponent>
						<div className="vertical text-xs text-gray-600 gap-1">
							<p className="font-semibold">How to read this chart:</p>
							<ul className="list-disc pl-5 space-y-1">
								<li>Each curve represents our belief about a region's success rate</li>
								<li>Taller, narrower curves indicate more confident predictions</li>
								<li>Curves shifted right indicate higher success rates</li>
								<li>α increases with successes, β with failures</li>
							</ul>
						</div>
					</TooltipComponent>
				</div>
				{/* <p className="text-xs text-gray-500">Higher peaks and rightward shifts indicate more successful regions</p> */}
			</div>
			<Line data={data} options={options} />
		</Card>
	);
}
