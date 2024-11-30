"use client";

import { motion } from "framer-motion";
import { useGlobal } from "@/context/globalContext";
import { Ambulance } from "lucide-react";
import RegionChart from "@/components/RegionChart";
import ControlPanel from "@/components/ControlPanel";
import BetaDistributionChart from "@/components/BetaDistributionChart";
import LearningChart from "@/components/LearningChart";
import ResourcesRemaining from "@/components/ResourcesRemaining";
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
					<div className="relative col-span-3 vertical gap-3 justify-between">
						<div />
						<RegionChart />
						<ResourcesRemaining />
						{results && (
							<motion.div className="absolute w-full top-0 left-0" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
								<Results />
							</motion.div>
						)}
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
