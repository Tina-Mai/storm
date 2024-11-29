"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Region } from "@/types/simulation";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface BetaDistributionChartProps {
	regions: Region[];
}

export default function BetaDistributionChart({ regions }: BetaDistributionChartProps) {
	// Generate x values for the beta distribution plot
	const xValues = Array.from({ length: 100 }, (_, i) => i / 100);

	// Beta distribution function
	const betaPDF = (x: number, alpha: number, beta: number) => {
		const B = Math.exp(lnGamma(alpha) + lnGamma(beta) - lnGamma(alpha + beta));
		return (x ** (alpha - 1) * (1 - x) ** (beta - 1)) / B;
	};

	// Log gamma function
	const lnGamma = (z: number) => {
		const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
		let sum = 1.000000000190015;
		for (let i = 0; i < 6; i++) {
			sum += c[i] / (z + i + 1);
		}
		return (z + 0.5) * Math.log(z + 5.5) - (z + 5.5) + Math.log((2.5066282746310005 * sum) / z);
	};

	const data = {
		labels: xValues,
		datasets: regions.map((region) => ({
			label: region.name,
			data: xValues.map((x) => betaPDF(x, region.alpha, region.beta)),
			borderColor: `hsl(${region.id * 120}, 70%, 50%)`,
			backgroundColor: `hsla(${region.id * 120}, 70%, 50%, 0.1)`,
			fill: true,
		})),
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: "Beta Distributions by Region",
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
			<Line data={data} options={options} />
		</div>
	);
}
