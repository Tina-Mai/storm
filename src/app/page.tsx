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
			<div className="flex-grow overflow-y-auto w-full bg-slate-100 border border-slate-200 rounded p-5">
				<div className="grid grid-cols-5 gap-5">
					{/* Status Column (2-col width) */}
					<div className="col-span-3">
						<Card>
							<h2 className="font-semibold text-sm uppercase tracking-widest">Status</h2>
							<div>
								<h3 className="font-semibold">Resources Remaining</h3>
								<p>
									{remainingResources} / {totalResources}
								</p>
							</div>
							{results && (
								<div>
									<h3 className="font-semibold">Final Results</h3>
									<p>Thompson Sampling: {results.thompsonSamplingSuccesses} successes</p>
									<p>Uniform Allocation: {results.uniformAllocationSuccesses} successes</p>
									<p className="text-green-600 font-semibold">
										Improvement: {(((results.thompsonSamplingSuccesses - results.uniformAllocationSuccesses) / results.uniformAllocationSuccesses) * 100).toFixed(1)}%
									</p>
								</div>
							)}
						</Card>
					</div>

					{/* Charts Column (1-col width) */}
					<div className="vertical col-span-2 gap-5">
						<ControlPanel />
						<RegionChart />
						<BetaDistributionChart />
						<LearningChart />
					</div>
				</div>
			</div>
		</main>
	);
}
