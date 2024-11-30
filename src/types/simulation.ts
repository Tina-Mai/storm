export interface Region {
	id: number;
	name: string;
	alpha: number;
	beta: number;
	hiddenEffectiveness: number;
	successCount: number;
	totalAttempts: number;
}

export interface SimulationResults {
	thompsonSamplingSuccesses: number;
	uniformAllocationSuccesses: number;
	totalAttempts: number;
}

export interface ResourceAllocation {
	id: number;
	targetRegion: string;
	success: boolean;
	progress: number;
}
