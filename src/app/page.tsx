"use client";

import { useState, useEffect, useCallback } from "react";
import RegionChart from "@/components/RegionChart";
import ControlPanel from "@/components/ControlPanel";
import BetaDistributionChart from "@/components/BetaDistributionChart";
import RewardTrendChart from "@/components/RewardTrendChart";
import { Region } from "@/types/simulation";

// Poisson random number generator
const poissonRandom = (lambda: number): number => {
	let L = Math.exp(-lambda);
	let k = 0;
	let p = 1;

	do {
		k++;
		p *= Math.random();
	} while (p > L);

	return k - 1;
};

export default function Home() {
	const [numRegions, setNumRegions] = useState(3);
	const [baseSeverity, setBaseSeverity] = useState(5);
	const [regions, setRegions] = useState<Region[]>([]);
	const [totalResources, setTotalResources] = useState(300);
	const [isSimulating, setIsSimulating] = useState(false);
	const [rewardHistory, setRewardHistory] = useState<number[]>([]);
	const [allocatedResources, setAllocatedResources] = useState(0);
	const [cumulativeAllocations, setCumulativeAllocations] = useState<{ [key: number]: number }>({});

	// Initialize regions with Poisson-distributed demands
	useEffect(() => {
		const newRegions = Array.from({ length: numRegions }, (_, i) => {
			const baseDemand = 100 * baseSeverity;
			const poissonDemand = poissonRandom(baseDemand);

			return {
				id: i + 1,
				name: `Region ${String.fromCharCode(65 + i)}`,
				demand: poissonDemand,
				allocated: 0,
				// Start with Beta(1,1) prior for each region
				alpha: 1,
				beta: 1,
				severity: baseSeverity,
			};
		});
		setRegions(newRegions);
		setRewardHistory([]);
		setAllocatedResources(0);
		setCumulativeAllocations({});
	}, [numRegions, baseSeverity]);

	// Update demands based on severity changes with Poisson distribution
	useEffect(() => {
		if (!isSimulating) {
			setRegions((prevRegions) =>
				prevRegions.map((region) => ({
					...region,
					demand: poissonRandom(100 * baseSeverity),
					severity: baseSeverity,
				}))
			);
		}
	}, [baseSeverity, isSimulating]);

	// Sample from beta distribution (more accurate implementation)
	const sampleBeta = (alpha: number, beta: number) => {
		const x = Math.random();
		const y = Math.random();

		// Using the ratio of gamma variates method
		const a = Math.pow(x, 1 / alpha);
		const b = Math.pow(y, 1 / beta);

		return a / (a + b);
	};

	// Calculate remaining demand for a region
	const getRemainingDemand = (region: Region) => {
		const currentAllocation = cumulativeAllocations[region.id] || 0;
		return Math.max(0, region.demand - currentAllocation);
	};

	// Calculate reward as defined in documentation
	const calculateReward = (allocated: number, demand: number) => {
		return Math.min(allocated / demand, 1);
	};

	// Reset simulation
	const resetSimulation = useCallback(() => {
		setRegions((prevRegions) =>
			prevRegions.map((region) => ({
				...region,
				allocated: 0,
				alpha: 1,
				beta: 1,
				demand: poissonRandom(100 * baseSeverity),
			}))
		);
		setRewardHistory([]);
		setIsSimulating(false);
		setAllocatedResources(0);
		setCumulativeAllocations({});
	}, [baseSeverity]);

	// Simulation step following Thompson Sampling algorithm
	const simulationStep = useCallback(() => {
		if (allocatedResources >= totalResources) {
			setIsSimulating(false);
			return;
		}

		// Sample from Beta distribution for each region
		const samples = regions.map((region) => ({
			id: region.id,
			value: sampleBeta(region.alpha, region.beta),
		}));

		// Choose region with highest sampled value
		const chosenRegion = samples.reduce((max, current) => (current.value > max.value ? current : max));

		// Calculate allocation size
		const resourcesRemaining = totalResources - allocatedResources;
		const chosenRegionObj = regions.find((r) => r.id === chosenRegion.id)!;
		const remainingDemand = getRemainingDemand(chosenRegionObj);

		const allocationSize = Math.min(
			remainingDemand, // Try to meet the demand
			resourcesRemaining, // Don't exceed available resources
			20 // Maximum per step for visualization purposes
		);

		if (allocationSize <= 0) {
			return;
		}

		// Update region states with new allocation and Beta parameters
		setRegions((prevRegions) => {
			return prevRegions.map((region) => {
				if (region.id === chosenRegion.id) {
					const newAllocation = (cumulativeAllocations[region.id] || 0) + allocationSize;
					const reward = calculateReward(allocationSize, region.demand);

					return {
						...region,
						allocated: newAllocation,
						// Update Beta parameters based on reward
						alpha: region.alpha + reward, // Success
						beta: region.beta + (1 - reward), // Failure
					};
				}
				return region;
			});
		});

		// Update cumulative allocations
		setCumulativeAllocations((prev) => ({
			...prev,
			[chosenRegion.id]: (prev[chosenRegion.id] || 0) + allocationSize,
		}));

		// Update allocated resources
		setAllocatedResources((prev) => prev + allocationSize);

		// Update reward history
		setRewardHistory((prev) => {
			const reward = calculateReward(allocationSize, chosenRegionObj.demand);
			return [...prev, reward];
		});
	}, [regions, totalResources, allocatedResources, cumulativeAllocations]);

	// Run simulation
	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		if (isSimulating) {
			intervalId = setInterval(simulationStep, 1000); // Run every second
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
						Resources Allocated: {allocatedResources.toFixed(0)} / {totalResources}
						{allocatedResources >= totalResources && <span className="text-red-500 ml-2">(Depleted)</span>}
					</p>
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
							baseSeverity={baseSeverity}
							setBaseSeverity={setBaseSeverity}
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
