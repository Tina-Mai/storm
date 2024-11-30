"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Region, SimulationResults } from "@/types/simulation";
import { initializeRegions, performThompsonSampling, updateRegion, calculateResults, simulateTrial } from "@/lib/probability";

interface GlobalContextType {
	// State
	numRegions: number;
	regions: Region[];
	totalResources: number;
	remainingResources: number;
	isSimulating: boolean;
	rewardHistory: number[];
	results: SimulationResults | null;

	// Actions
	setNumRegions: (num: number) => void;
	setTotalResources: (resources: number) => void;
	setIsSimulating: (isSimulating: boolean) => void;
	resetSimulation: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
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

	const value = {
		numRegions,
		regions,
		totalResources,
		remainingResources,
		isSimulating,
		rewardHistory,
		results,
		setNumRegions,
		setTotalResources,
		setIsSimulating,
		resetSimulation,
	};

	return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

export function useGlobal() {
	const context = useContext(GlobalContext);
	if (context === undefined) {
		throw new Error("useGlobal must be used within a GlobalProvider");
	}
	return context;
}
