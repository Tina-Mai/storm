"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { useGlobal } from "@/context/globalContext";
import Card from "@/components/ui/card";
import { TooltipItem } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
		datasets: regions.map((region) => ({
			type: "line" as const,
			label: `${region.name}`,
			data: xValues.map((x) => betaPDF(x, region.alpha, region.beta)),
			borderColor: `hsl(${region.id * 120}, 70%, 50%)`,
			backgroundColor: `hsla(${region.id * 120}, 70%, 50%, 0.1)`,
			fill: true,
			id: region.id.toString(),
			order: region.id,
		})),
	};

	const options: ChartOptions<"line"> = {
		responsive: true,
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
			<div className="vertical gap-1">
				<h2 className="font-semibold text-sm uppercase tracking-widest">Beta Distributions by Region</h2>
				<p className="text-xs text-gray-500">Higher peaks and rightward shifts indicate more successful regions</p>
			</div>

			<Line data={data} options={options} />
			<div className="mt-4 text-sm text-gray-600">
				<p>
					<strong>How to read this chart:</strong>
				</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>Each curve represents our belief about a region's success rate</li>
					<li>Taller, narrower curves indicate more confident predictions</li>
					<li>Curves shifted right indicate higher success rates</li>
					<li>α increases with successes, β with failures</li>
				</ul>
			</div>
		</Card>
	);
}
