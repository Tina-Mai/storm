"use client";

import { useGlobal } from "@/context/globalContext";
import { Package } from "lucide-react";

export default function ResourcesRemaining() {
	const { remainingResources, totalResources } = useGlobal();
	const percentage = (remainingResources / totalResources) * 100;

	return (
		<div className="horizontal w-full items-center gap-3">
			<div className="relative flex-grow h-2 bg-slate-300 rounded-full overflow-hidden">
				<div className="absolute h-full bg-slate-800 transition-all duration-300 rounded-full" style={{ width: `${percentage}%` }} />
			</div>
			<div className="horizontal items-center justify-center text-sm gap-1">
				<span className="font-mono text-[13px] pr-1">
					{remainingResources.toString().padStart(3, "0")} / {totalResources}
				</span>{" "}
				resources left
				<Package size={18} className="ml-1" />
			</div>
		</div>
	);
}
