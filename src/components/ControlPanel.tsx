"use client";

import { useGlobal } from "@/context/globalContext";

export default function ControlPanel() {
	const { totalResources, setTotalResources, isSimulating, setIsSimulating, resetSimulation, numRegions, setNumRegions } = useGlobal();

	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-semibold mb-4">Simulation Controls</h2>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">Number of Regions</label>
					<div className="flex items-center space-x-2">
						<input type="range" min="2" max="10" step="1" value={numRegions} onChange={(e) => setNumRegions(Number(e.target.value))} className="flex-grow mt-1" disabled={isSimulating} />
						<span className="text-sm text-gray-500 w-12">{numRegions}</span>
					</div>
					<p className="text-xs text-gray-500 mt-1">Each region has a hidden effectiveness rate</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Total Resources (Attempts)</label>
					<div className="flex items-center space-x-2">
						<input type="range" min="100" max="1000" step="50" value={totalResources} onChange={(e) => setTotalResources(Number(e.target.value))} className="flex-grow mt-1" />
						<span className="text-sm text-gray-500 w-16">{totalResources}</span>
					</div>
					<p className="text-xs text-gray-500 mt-1">Number of allocation attempts to make</p>
				</div>

				<div className="pt-2 flex space-x-4">
					<button
						onClick={() => setIsSimulating(!isSimulating)}
						className={`flex-1 px-4 py-2 rounded-md ${isSimulating ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
					>
						{isSimulating ? "Stop Simulation" : "Start Simulation"}
					</button>

					<button className="flex-1 px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white" onClick={resetSimulation}>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
}
