"use client";

import { useState, useEffect, useCallback } from "react";
import RegionChart from "@/components/RegionChart";
import ControlPanel from "@/components/ControlPanel";
import BetaDistributionChart from "@/components/BetaDistributionChart";
import RewardTrendChart from "@/components/RewardTrendChart";
import { Region, SimulationResults } from "@/types/simulation";
import { simulateTrial, initializeRegions, performThompsonSampling, updateRegion, calculateResults } from "@/lib/probability";

export default function Home() {
	const [numRegions, setNumRegions] = useState(3);
	const [regions, setRegions] = useState<Region[]>([]);
	const [totalResources, setTotalResources] = useState(300);
	const [remainingResources, setRemainingResources] = useState(300);
	const [isSimulating, setIsSimulating] = useState(false);
	const [rewardHistory, setRewardHistory] = useState<number[]>([]);
	const [results, setResults] = useState<SimulationResults | null>(null);

	// Initialize regions
	useEffect(() => {
		const newRegions = initializeRegions(numRegions);
		setRegions(newRegions);
		setRewardHistory([]);
		setRemainingResources(totalResources);
		setResults(null);
	}, [numRegions, totalResources]);

	// Reset simulation
	const resetSimulation = useCallback(() => {
		setRegions((regions) =>
			regions.map((region) => ({
				...region,
				alpha: 1,
				beta: 1,
				successCount: 0,
				totalAttempts: 0,
			}))
		);
		setRewardHistory([]);
		setRemainingResources(totalResources);
		setIsSimulating(false);
		setResults(null);
	}, [totalResources]);

	// Simulation step
	const simulationStep = useCallback(() => {
		if (remainingResources <= 0) {
			setIsSimulating(false);
			setResults(calculateResults(regions, totalResources));
			return;
		}

		const chosenRegion = performThompsonSampling(regions);

		// Simulate outcome and update state
		setRegions((prevRegions) => {
			return prevRegions.map((region) => {
				if (region.id === chosenRegion.id) {
					const success = simulateTrial(region.hiddenEffectiveness);
					return updateRegion(region, success);
				}
				return region;
			});
		});

		setRemainingResources((prev) => prev - 1);
		setRewardHistory((prev) => {
			const region = regions.find((r) => r.id === chosenRegion.id);
			if (!region) return prev;
			const success = simulateTrial(region.hiddenEffectiveness);
			return [...prev, success ? 1 : 0];
		});
	}, [regions, remainingResources, totalResources]);

	// Run simulation
	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		if (isSimulating) {
			intervalId = setInterval(simulationStep, 100);
		}
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isSimulating, simulationStep]);

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
						<ControlPanel
							totalResources={totalResources}
							setTotalResources={setTotalResources}
							isSimulating={isSimulating}
							setIsSimulating={setIsSimulating}
							onReset={resetSimulation}
							numRegions={numRegions}
							setNumRegions={setNumRegions}
						/>
						<RegionChart regions={regions} />
					</div>

					<div className="space-y-8">
						<BetaDistributionChart regions={regions} />
						<RewardTrendChart rewardHistory={rewardHistory} />
					</div>
				</div>
			</div>
		</main>
	);
}
