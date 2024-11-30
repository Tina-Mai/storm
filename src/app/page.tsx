"use client";

import RegionChart from "@/components/RegionChart";
import ControlPanel from "@/components/ControlPanel";
import BetaDistributionChart from "@/components/BetaDistributionChart";
import LearningChart from "@/components/LearningChart";
import { useGlobal } from "@/context/globalContext";
import ResourcesRemaining from "@/components/ResourcesRemaining";
import { Ambulance } from "lucide-react";
import Results from "@/components/Results";

export default function Home() {
	const { results } = useGlobal();

	return (
		<main className="vertical bg-white h-screen p-3">
			<header className="horizontal justify-between items-center pb-2 -pt-1">
				<div className="horizontal items-center gap-2">
					<Ambulance size={24} />
					<p className="font-mono text-2xl">STORM</p>
				</div>
				<p className="text-sm text-slate-500">Disaster relief resource optimization using Thompson Sampling</p>
			</header>
			<div className="flex-grow overflow-y-auto w-full bg-slate-100 border border-slate-200 rounded p-4">
				<div className="grid grid-cols-5 gap-5">
					{/* Status Column  */}
					<div className="col-span-3 vertical gap-3 justify-between">
						{results && <Results />}

						<RegionChart />
						<ResourcesRemaining />
					</div>

					{/* Charts Column */}
					<div className="col-span-2 vertical gap-3">
						<ControlPanel />
						<BetaDistributionChart />
						<LearningChart />
					</div>
				</div>
			</div>
		</main>
	);
}
