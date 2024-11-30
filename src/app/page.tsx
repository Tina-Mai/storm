"use client";

import RegionChart from "@/components/RegionChart";
import ControlPanel from "@/components/ControlPanel";
import BetaDistributionChart from "@/components/BetaDistributionChart";
import RewardTrendChart from "@/components/RewardTrendChart";
import { useGlobal } from "@/context/globalContext";

export default function Home() {
	const { remainingResources, totalResources, results } = useGlobal();

	return (
		<main className="min-h-screen p-8">
			<div className="max-w-7xl mx-auto space-y-8">
				<header className="text-center">
					<h1 className="text-4xl font-bold mb-2">STORM</h1>
					<p className="text-xl text-gray-600">Statistical Tools for Optimizing Resource Management</p>
					<p className="text-lg text-gray-500 mt-2">
						Resources Remaining: {remainingResources} / {totalResources}
					</p>
					{results && (
						<div className="mt-4 p-4 bg-white rounded-lg shadow-md">
							<h3 className="text-lg font-semibold mb-2">Results</h3>
							<p>Thompson Sampling: {results.thompsonSamplingSuccesses} successes</p>
							<p>Uniform Allocation: {results.uniformAllocationSuccesses} successes</p>
							<p className="text-green-600 font-semibold">
								Improvement: {(((results.thompsonSamplingSuccesses - results.uniformAllocationSuccesses) / results.uniformAllocationSuccesses) * 100).toFixed(1)}%
							</p>
						</div>
					)}
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-8">
						<ControlPanel />
						<RegionChart />
					</div>

					<div className="space-y-8">
						<BetaDistributionChart />
						<RewardTrendChart />
					</div>
				</div>
			</div>
		</main>
	);
}
