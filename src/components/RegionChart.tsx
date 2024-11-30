"use client";

import { useGlobal } from "@/context/globalContext";
import { motion, ResolvedValues } from "framer-motion";
import { useEffect, useState } from "react";
import { ResourceAllocation } from "@/types/simulation";

export default function RegionChart() {
	const { regions, isSimulating, remainingResources } = useGlobal();
	const [prevRegions, setPrevRegions] = useState(regions);

	// Size constants
	const centerX = 300;
	const centerY = 300;
	const radius = 220;

	const getRegionPosition = (index: number, total: number) => {
		const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
		return {
			x: centerX + radius * Math.cos(angle),
			y: centerY + radius * Math.sin(angle),
		};
	};

	// Calculate progress bars directly from regions data
	const maxAttempts = Math.max(...regions.map((r) => r.totalAttempts)) || 1; // Avoid division by zero

	// Track only animations
	const [animations, setAnimations] = useState<ResourceAllocation[]>([]);

	// Track resource allocations for animations only
	useEffect(() => {
		if (isSimulating) {
			const updatedRegion = regions.find((region, index) => {
				const prevRegion = prevRegions[index];
				return region.totalAttempts > prevRegion.totalAttempts;
			});

			if (updatedRegion) {
				const prevRegion = prevRegions.find((r) => r.id === updatedRegion.id);
				const wasSuccessful = prevRegion && updatedRegion.successCount > prevRegion.successCount;

				setAnimations((prev: ResourceAllocation[]) => [
					...prev,
					{
						id: remainingResources,
						targetRegion: updatedRegion.name,
						success: wasSuccessful || false,
						progress: 0,
					},
				]);
			}
		}
		setPrevRegions(regions);
	}, [regions, isSimulating, remainingResources]);

	// Clean up completed animations
	useEffect(() => {
		const cleanup = setInterval(() => {
			setAnimations((prev: ResourceAllocation[]) => prev.filter((a: ResourceAllocation) => a.progress < 1));
		}, 1000);

		return () => clearInterval(cleanup);
	}, []);

	return (
		<div className="relative w-[600px] h-[600px] mx-auto">
			{/* Connection Lines */}
			<svg className="absolute inset-0 w-full h-full">
				{regions.map((region, index) => {
					const pos = getRegionPosition(index, regions.length);
					return <line key={`line-${region.name}`} x1={centerX} y1={centerY} x2={pos.x} y2={pos.y} className="stroke-slate-300" strokeWidth={1} />;
				})}

				{/* Animated Resource Lines */}
				{animations.map((allocation) => {
					const targetRegion = regions.findIndex((r) => r.name === allocation.targetRegion);
					const targetPos = getRegionPosition(targetRegion, regions.length);

					return (
						<motion.line
							key={`resource-${allocation.id}`}
							x1={centerX}
							y1={centerY}
							x2={targetPos.x}
							y2={targetPos.y}
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 1, ease: "easeInOut" }}
							className={allocation.success ? "stroke-emerald-400" : "stroke-red-400"}
							strokeWidth={2}
							strokeDasharray="5,5"
						/>
					);
				})}
			</svg>

			{/* Central Hub */}
			<div
				className="absolute left-[270px] top-[270px] w-[60px] h-[60px] rounded-full 
								border border-slate-200 bg-white 
								flex items-center justify-center
								transform transition-transform hover:scale-105
								cursor-pointer"
				style={{
					boxShadow: `
							3px 3px 0 rgba(203, 213, 225, 0.4),
							6px 6px 0 rgba(203, 213, 225, 0.3),
							inset -2px -2px 4px rgba(0,0,0,0.1)
						`,
				}}
			>
				<span className="text-sm text-slate-700 font-medium drop-shadow-sm">Hub</span>
			</div>

			{/* Regions */}
			{regions.map((region, index) => {
				const pos = getRegionPosition(index, regions.length);
				const normalizedSuccesses = (region.successCount / maxAttempts) * 100;
				const normalizedFailures = ((region.totalAttempts - region.successCount) / maxAttempts) * 100;

				return (
					<div
						key={region.name}
						className="absolute -ml-[50px] -mt-[50px]"
						style={{
							left: pos.x,
							top: pos.y,
						}}
					>
						{/* Progress Bar */}
						<div className="w-full h-2.5 mb-2 flex justify-center items-center">
							{/* Container */}
							<div
								className="relative w-[90px] h-full bg-slate-100 rounded-full overflow-hidden"
								style={{
									boxShadow: `
										inset 0 1px 2px rgba(0,0,0,0.1),
										0 1px 0 rgba(255,255,255,0.5)
									`,
								}}
							>
								{/* Failures (left side) */}
								<div
									className="absolute right-[50%] h-full bg-red-400 rounded-l-full transition-all duration-300"
									style={{
										width: `${normalizedFailures / 2}%`,
										boxShadow: "inset -1px 0 2px rgba(0,0,0,0.1)",
									}}
								/>
								{/* Successes (right side) */}
								<div
									className="absolute left-[50%] h-full bg-emerald-400 rounded-r-full transition-all duration-300"
									style={{
										width: `${normalizedSuccesses / 2}%`,
										boxShadow: "inset 1px 0 2px rgba(0,0,0,0.1)",
									}}
								/>
								{/* Center line */}
								<div className="absolute left-[50%] top-0 w-[1px] h-full bg-slate-300/50" />
							</div>
						</div>

						{/* Region Box */}
						<div
							className="w-[100px] h-[100px] 
										rounded-lg border border-slate-200 
										flex items-center justify-center
										transform transition-transform hover:scale-105
										cursor-pointer bg-white"
							style={{
								boxShadow: `
									3px 3px 0 rgba(203, 213, 225, 0.4),
									6px 6px 0 rgba(203, 213, 225, 0.3),
									inset -2px -2px 4px rgba(0,0,0,0.1)
								`,
							}}
						>
							<span className="text-sm font-medium text-slate-700 drop-shadow-sm text-center">{region.name}</span>
						</div>
					</div>
				);
			})}

			{/* Resource Particles */}
			{animations.map((allocation) => {
				const targetRegion = regions.findIndex((r) => r.name === allocation.targetRegion);
				const targetPos = getRegionPosition(targetRegion, regions.length);

				return (
					<motion.div
						key={allocation.id}
						className={`absolute w-2 h-2 rounded-full shadow-md
								${allocation.success ? "bg-emerald-400" : "bg-red-400"}`}
						initial={{
							x: centerX,
							y: centerY,
							scale: 0.5,
							opacity: 0,
						}}
						animate={{
							x: targetPos.x,
							y: targetPos.y,
							scale: [0.5, 1.2, 0.8],
							opacity: [0, 1, 0],
						}}
						transition={{
							duration: 1,
							ease: "easeInOut",
							scale: {
								times: [0, 0.5, 1],
								duration: 1,
							},
							opacity: {
								times: [0, 0.2, 1],
								duration: 1,
							},
						}}
						onUpdate={(latest: ResolvedValues) => {
							const x = latest.x as number;
							if (x !== undefined) {
								const dx = targetPos.x - centerX;
								const dy = targetPos.y - centerY;
								const totalDistance = Math.sqrt(dx * dx + dy * dy);
								const currentDx = x - centerX;
								const currentDy = (latest.y as number) - centerY;
								const currentDistance = Math.sqrt(currentDx * currentDx + currentDy * currentDy);
								const progress = currentDistance / totalDistance;

								setAnimations((prev: ResourceAllocation[]) => prev.map((a) => (a.id === allocation.id ? { ...a, progress } : a)));
							}
						}}
					/>
				);
			})}
		</div>
	);
}
