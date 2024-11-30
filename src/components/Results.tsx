import { useGlobal } from "@/context/globalContext";
import Card from "@/components/ui/card";
import { ChartSpline, Dice3, TrendingUp, TrendingDown } from "lucide-react";

const Results = () => {
	const { results } = useGlobal();
	const positive = results?.thompsonSamplingSuccesses && results?.uniformAllocationSuccesses && results?.thompsonSamplingSuccesses > results?.uniformAllocationSuccesses;

	if (!results) return null;
	return (
		<Card>
			<h2 className="font-semibold text-sm uppercase tracking-widest text-center pb-2">FINAL RESULTS</h2>
			<div className="grid grid-cols-3">
				<div className="vertical items-center">
					<ChartSpline size={24} className="pb-1" />
					<div className="horizontal items-center text-sm gap-1.5">
						<span className="font-mono text-base">{results.thompsonSamplingSuccesses}</span> <p>successes</p>
					</div>
					<p className="text-sm text-slate-500 text-center">Thompson Sampling</p>
				</div>
				<div className="vertical items-center">
					<Dice3 size={24} className="pb-1" />
					<div className="horizontal items-center text-sm gap-1.5">
						<span className="font-mono text-base">{results.uniformAllocationSuccesses}</span> <p>successes</p>
					</div>
					<p className="text-sm text-slate-500 text-center">Evenly distributing across regions</p>
				</div>
				<div className={`vertical items-center font-semibold ${positive ? "text-theme-green" : "text-theme-red"}`}>
					{!positive ? <TrendingDown size={24} className="pb-1" /> : <TrendingUp size={24} className="pb-1" />}
					<p className="font-mono">{(((results.thompsonSamplingSuccesses - results.uniformAllocationSuccesses) / results.uniformAllocationSuccesses) * 100).toFixed(1)}% </p>
					<p className="text-sm text-center">Improvement</p>
				</div>
			</div>
		</Card>
	);
};

export default Results;
