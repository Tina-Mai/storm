export interface Region {
	id: number;
	name: string;
	demand: number;
	allocated: number;
	alpha: number;
	beta: number;
	severity: number;
}

export interface SimulationState {
	regions: Region[];
	totalResources: number;
	rewardHistory: number[];
}
