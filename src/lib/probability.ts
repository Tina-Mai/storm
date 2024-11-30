import { Region, SimulationResults } from "@/types/simulation";
import jStat from "jstat";

/**
 * Initializes regions for the multi-armed bandit problem.
 * Each region starts with Beta(1,1) prior (uniform distribution)
 * and gets assigned a hidden effectiveness rate.
 *
 * @param numRegions - Number of regions (arms) to create
 * @returns Array of initialized regions
 *
 * Probability concepts:
 * - Beta(1,1) is uniform prior (no initial bias)
 * - Each arm has hidden parameter θᵢ (effectiveness)
 */
export const initializeRegions = (numRegions: number): Region[] => {
	const regionNames = ["Bayes Land", "Piech Land", "Gauss Land", "Poisson Land", "Bernoulli Land", "Thompson Land", "Laplace Land", "Shannon Land", "De Morgan Land", "Kolmogorov Land"];

	return Array.from({ length: numRegions }, (_, i) => ({
		id: i + 1,
		name: regionNames[i],
		alpha: 1,
		beta: 1,
		hiddenEffectiveness: generateEffectiveness(i, numRegions),
		successCount: 0,
		totalAttempts: 0,
	}));
};

/**
 * Generates hidden effectiveness rates for each region.
 * Creates a challenging multi-armed bandit problem by ensuring:
 * 1. One very good option (optimal arm)
 * 2. One very bad option (arm to avoid)
 * 3. Random options in between
 *
 * @param index - Region index
 * @param total - Total number of regions
 * @returns Hidden effectiveness rate for the region
 *
 * Probability concepts:
 * - Creates a multi-armed bandit problem
 * - Ensures exploration is necessary (random middle options)
 * - Maintains clear optimal/suboptimal choices for validation
 */
export const generateEffectiveness = (index: number, total: number) => {
	// Randomly select indices for good and bad regions using proper uniform sampling
	const goodIndex = Math.floor(jStat.uniform.sample(0, total));
	let badIndex;
	do {
		badIndex = Math.floor(jStat.uniform.sample(0, total));
	} while (badIndex === goodIndex);

	if (index === goodIndex) {
		// High reward arm: p ∈ [0.7, 0.85] using uniform distribution
		return jStat.uniform.sample(0.7, 0.85);
	} else if (index === badIndex) {
		// Low reward arm: p ∈ [0.2, 0.35] using uniform distribution
		return jStat.uniform.sample(0.2, 0.35);
	} else {
		// Random arms: p ∈ [0, 1] using uniform distribution
		return jStat.uniform.sample(0.1, 0.9);
	}
};

/**
 * Samples from a Beta distribution using jStat library.
 * Beta distribution is the conjugate prior for Bernoulli trials,
 * making it ideal for tracking success probabilities.
 *
 * @param alpha - Number of successes plus 1 (pseudo-count)
 * @param beta - Number of failures plus 1 (pseudo-count)
 * @returns A random value from Beta(alpha, beta)
 */
export const sampleBeta = (alpha: number, beta: number) => {
	return jStat.beta.sample(alpha, beta);
};

/**
 * Simulates a Bernoulli trial with given success probability.
 * Used to simulate outcomes in each region based on their true effectiveness.
 *
 * @param effectiveness - Probability of success (p in Bernoulli(p))
 * @returns true with probability 'effectiveness', false otherwise
 *
 * Probability concepts:
 * - For X ~ Bernoulli(p): P(X = 1) = p, P(X = 0) = 1-p
 * - Implemented using inverse transform sampling:
 *   If U ~ Uniform(0,1), then I(U < p) ~ Bernoulli(p)
 */
export const simulateTrial = (effectiveness: number): boolean => {
	return Math.random() < effectiveness;
};

/**
 * Implements Thompson Sampling algorithm for arm selection.
 * Samples from each region's posterior distribution and selects
 * the region with highest sampled value.
 *
 * @param regions - Array of regions
 * @returns Selected region based on Thompson Sampling
 *
 * Probability concepts:
 * - For each arm i, sample θᵢ ~ Beta(αᵢ, βᵢ)
 * - Select arm with highest sampled θᵢ
 * - Posterior distribution: Beta(αᵢ + successes, βᵢ + failures)
 */
export const performThompsonSampling = (regions: Region[]) => {
	// Sample from each region's beta distribution
	const samples = regions.map((region) => ({
		id: region.id,
		value: sampleBeta(region.alpha, region.beta),
	}));

	// Choose region with highest sampled value
	return samples.reduce((max, current) => (current.value > max.value ? current : max));
};

/**
 * Updates region statistics after an allocation attempt.
 * Updates Beta distribution parameters based on outcome.
 *
 * @param region - Region to update
 * @param success - Whether the allocation was successful
 * @returns Updated region
 *
 * Probability concepts:
 * - Posterior update: Beta(α + s, β + f)
 * - s: number of successes (0 or 1)
 * - f: number of failures (1 - s)
 */
export const updateRegion = (region: Region, success: boolean): Region => {
	return {
		...region,
		alpha: region.alpha + (success ? 1 : 0),
		beta: region.beta + (success ? 0 : 1),
		successCount: region.successCount + (success ? 1 : 0),
		totalAttempts: region.totalAttempts + 1,
	};
};

/**
 * Simulates uniform resource allocation strategy for comparison.
 * Allocates resources equally among all regions.
 *
 * @param regions - Array of regions
 * @param totalResources - Total resources to allocate
 * @returns Total number of successes achieved
 *
 * Probability concepts:
 * - Baseline strategy: p(select arm i) = 1/N for all i
 * - Expected reward: Σ (θᵢ/N) where θᵢ is arm i's effectiveness
 */
export const simulateUniformAllocation = (regions: Region[], totalResources: number): number => {
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
};

/**
 * Calculates final results comparing Thompson Sampling to uniform allocation.
 *
 * @param regions - Array of regions with final states
 * @param totalResources - Total resources allocated
 * @returns Comparison of strategies' performance
 *
 * Probability concepts:
 * - Compares actual Thompson Sampling results to expected value of uniform allocation
 * - Improvement = (TS_successes - Uniform_successes) / Uniform_successes
 */
export const calculateResults = (regions: Region[], totalResources: number): SimulationResults => {
	const uniformSuccesses = simulateUniformAllocation(regions, totalResources);
	const thompsonSuccesses = regions.reduce((sum, r) => sum + r.successCount, 0);

	return {
		thompsonSamplingSuccesses: thompsonSuccesses,
		uniformAllocationSuccesses: uniformSuccesses,
		totalAttempts: totalResources,
	};
};
