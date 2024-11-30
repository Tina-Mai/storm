"use client";

import RegionChart from "@/components/RegionChart";
import ControlPanel from "@/components/ControlPanel";
import BetaDistributionChart from "@/components/BetaDistributionChart";
import LearningChart from "@/components/LearningChart";
import { useGlobal } from "@/context/globalContext";
import Card from "@/components/ui/card";

export default function Home() {
	const { remainingResources, totalResources, results } = useGlobal();

	return (
		<main className="vertical bg-white h-screen p-3">
			<header className="horizontal justify-between items-center pb-2 -pt-1">
				<p className="font-mono text-2xl">STORM</p>
				<p className="text-sm text-slate-500">Disaster relief resource optimization using Thompson Sampling</p>
			</header>
			<div className="flex-grow overflow-y-auto w-full bg-slate-100 border border-slate-200 rounded p-5 space-y-8">
				<div className="text-center">
					<p className="text-lg text-gray-500 mt-2">
						Resources Remaining: {remainingResources} / {totalResources}
					</p>
					{results && (
						<Card>
							<h3 className="text-lg font-semibold mb-2">Results</h3>
							<p>Thompson Sampling: {results.thompsonSamplingSuccesses} successes</p>
							<p>Uniform Allocation: {results.uniformAllocationSuccesses} successes</p>
							<p className="text-green-600 font-semibold">
								Improvement: {(((results.thompsonSamplingSuccesses - results.uniformAllocationSuccesses) / results.uniformAllocationSuccesses) * 100).toFixed(1)}%
							</p>
						</Card>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-8">
						<ControlPanel />
						<RegionChart />
					</div>

					<div className="space-y-8">
						<BetaDistributionChart />
						<LearningChart />
					</div>
				</div>
			</div>
		</main>
	);
}
