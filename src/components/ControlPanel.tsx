"use client";
import { useGlobal } from "@/context/globalContext";
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCw } from "lucide-react";

export default function ControlPanel() {
	const { totalResources, setTotalResources, isSimulating, setIsSimulating, resetSimulation, numRegions, setNumRegions } = useGlobal();

	return (
		<Card>
			<h2 className="font-semibold text-sm uppercase tracking-widest">Simulation Controls</h2>

			<div className="vertical gap-3">
				<div className="grid grid-cols-[minmax(auto,100px)_1fr_auto] items-center gap-5">
					<p className="text-sm font-medium text-gray-700"># of Regions</p>
					<Slider value={[numRegions]} onValueChange={([value]) => setNumRegions(value)} min={2} max={10} step={1} disabled={isSimulating} />
					<span className="text-sm text-gray-500 whitespace-nowrap">{numRegions}</span>
				</div>

				<div className="grid grid-cols-[minmax(auto,100px)_1fr_auto] items-center gap-5">
					<p className="text-sm font-medium text-gray-700">Total Resources</p>
					<Slider value={[totalResources]} onValueChange={([value]) => setTotalResources(value)} min={100} max={1000} step={50} />
					<span className="text-sm text-gray-500 whitespace-nowrap">{totalResources}</span>
				</div>

				<div className="pt-2 flex space-x-4">
					<Button onClick={() => setIsSimulating(!isSimulating)} variant={isSimulating ? "secondary" : "default"}>
						{isSimulating ? (
							<div className="horizontal items-center gap-2">
								<Pause size={16} />
								Pause Simulation
							</div>
						) : (
							<div className="horizontal items-center gap-2">
								<Play size={16} />
								Start Simulation
							</div>
						)}
					</Button>

					<Button onClick={resetSimulation} variant="outline">
						<div className="horizontal items-center gap-2">
							<RotateCw size={16} />
							Reset
						</div>
					</Button>
				</div>
			</div>
		</Card>
	);
}
