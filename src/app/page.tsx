"use client";

import { useState, useEffect, useCallback } from "react";
import RegionChart from "@/components/RegionChart";
import ControlPanel from "@/components/ControlPanel";
import BetaDistributionChart from "@/components/BetaDistributionChart";
import RewardTrendChart from "@/components/RewardTrendChart";
import { Region, SimulationResults } from "@/types/simulation";

export default function Home() {
	const [numRegions, setNumRegions] = useState(3);
	const [regions, setRegions] = useState<Region[]>([]);
	const [totalResources, setTotalResources] = useState(300);
	const [remainingResources, setRemainingResources] = useState(300);
	const [isSimulating, setIsSimulating] = useState(false);
	const [rewardHistory, setRewardHistory] = useState<number[]>([]);
	const [results, setResults] = useState<SimulationResults | null>(null);

	// Helper to generate effectiveness values with high variance
	const generateEffectiveness = (index: number, total: number) => {
		// Pre-determine which indices will be good and bad
		const goodIndex = Math.floor(Math.random() * total);
		let badIndex;
		do {
			badIndex = Math.floor(Math.random() * total);
		} while (badIndex === goodIndex);

		if (index === goodIndex) {
			// One very good region (70-90% success rate)
			return 0.7 + Math.random() * 0.2;
		} else if (index === badIndex) {
			// One very bad region (10-25% success rate)
			return 0.1 + Math.random() * 0.15;
		} else {
			// Other regions follow a more extreme distribution
			const baseRate = Math.random();
			// Square the random value to bias towards extremes
			return baseRate * baseRate * 0.7 + 0.15; // Range: 0.15 to 0.85
		}
	};

	// Initialize regions
	useEffect(() => {
		const newRegions = Array.from({ length: numRegions }, (_, i) => ({
			id: i + 1,
			name: `Region ${String.fromCharCode(65 + i)}`,
			alpha: 1,
			beta: 1,
			hiddenEffectiveness: generateEffectiveness(i, numRegions),
			successCount: 0,
			totalAttempts: 0,
		}));
		setRegions(newRegions);
		setRewardHistory([]);
		setRemainingResources(totalResources);
		setResults(null);
	}, [numRegions, totalResources]);

	// Sample from beta distribution
	const sampleBeta = (alpha: number, beta: number) => {
		const x = Math.random();
		const y = Math.random();
		const a = Math.pow(x, 1 / alpha);
		const b = Math.pow(y, 1 / beta);
		return a / (a + b);
	};

	// Simulate Bernoulli trial
	const simulateTrial = (effectiveness: number): boolean => {
		return Math.random() < effectiveness;
	};

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

	// Simulate uniform allocation for comparison
	const simulateUniformAllocation = useCallback(() => {
		let successes = 0;
		const attemptsPerRegion = Math.floor(totalResources / regions.length);

		regions.forEach((region) => {
			for (let i = 0; i < attemptsPerRegion; i++) {
				if (simulateTrial(region.hiddenEffectiveness)) {
					successes++;
				}
			}
		});

		return successes;
	}, [totalResources, regions]);

	// Simulation step
	const simulationStep = useCallback(() => {
		if (remainingResources <= 0) {
			setIsSimulating(false);
			// Compare with uniform allocation
			const uniformSuccesses = simulateUniformAllocation();
			const thompsonSuccesses = regions.reduce((sum, r) => sum + r.successCount, 0);
			setResults({
				thompsonSamplingSuccesses: thompsonSuccesses,
				uniformAllocationSuccesses: uniformSuccesses,
				totalAttempts: totalResources,
			});
			return;
		}

		// Sample from each region's beta distribution
		const samples = regions.map((region) => ({
			id: region.id,
			value: sampleBeta(region.alpha, region.beta),
		}));

		// Choose region with highest sampled value
		const chosenRegion = samples.reduce((max, current) => (current.value > max.value ? current : max));

		// Simulate outcome
		setRegions((prevRegions) => {
			return prevRegions.map((region) => {
				if (region.id === chosenRegion.id) {
					const success = simulateTrial(region.hiddenEffectiveness);
					return {
						...region,
						alpha: region.alpha + (success ? 1 : 0),
						beta: region.beta + (success ? 0 : 1),
						successCount: region.successCount + (success ? 1 : 0),
						totalAttempts: region.totalAttempts + 1,
					};
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
	}, [regions, remainingResources, totalResources, simulateUniformAllocation]);

	// Run simulation
	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		if (isSimulating) {
			intervalId = setInterval(simulationStep, 100); // Faster simulation
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
