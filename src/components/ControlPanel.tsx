"use client";
import { useGlobal } from "@/context/globalContext";
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function ControlPanel() {
	const { totalResources, setTotalResources, isSimulating, setIsSimulating, resetSimulation, numRegions, setNumRegions } = useGlobal();

	return (
		<Card>
			<h2 className="font-semibold text-sm uppercase tracking-widest">Simulation Controls</h2>

			<div className="vertical gap-3">
				<div>
					<label className="block text-sm font-medium text-gray-700">Number of Regions</label>
					<div className="flex items-center space-x-2">
						<Slider value={[numRegions]} onValueChange={([value]) => setNumRegions(value)} min={2} max={10} step={1} disabled={isSimulating} className="flex-grow mt-1" />
						<span className="text-sm text-gray-500 w-12">{numRegions}</span>
					</div>
					<p className="text-xs text-gray-500 mt-1">Each region has a hidden effectiveness rate</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Total Resources (Attempts)</label>
					<div className="flex items-center space-x-2">
						<Slider value={[totalResources]} onValueChange={([value]) => setTotalResources(value)} min={100} max={1000} step={50} className="flex-grow mt-1" />
						<span className="text-sm text-gray-500 w-16">{totalResources}</span>
					</div>
					<p className="text-xs text-gray-500 mt-1">Number of allocation attempts to make</p>
				</div>

				<div className="pt-2 flex space-x-4">
					<Button onClick={() => setIsSimulating(!isSimulating)} variant={isSimulating ? "destructive" : "default"}>
						{isSimulating ? "Stop Simulation" : "Start Simulation"}
					</Button>

					<Button onClick={resetSimulation} variant="outline">
						Reset
					</Button>
				</div>
			</div>
		</Card>
	);
}
