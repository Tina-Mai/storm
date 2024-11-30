"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		// Show dialog when component mounts
		setOpen(true);
	}, []);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader className="vertical items-center gap-2 font-mono text-lg uppercase font-medium !text-center">
					<Ambulance size={24} />
					Welcome to STORM
				</DialogHeader>
				<div className="vertical text-sm gap-3">
					<p>
						Climate change is increasing the risk of disasters. STORM (Strategic Thompson-sampling Optimized Resource Management) demonstrates using probability to optimize allocating
						disaster relief resources.
					</p>
					<p>
						Each time a batch of resources is delivered, we observe if allocating resources to that region was effective, and update the Beta distribution for that region. This is how
						Thompson Sampling “learns” which regions are best to allocate resources to.
					</p>
					<p>Try different scenarios by adjusting the parameters in the control panel, and watch how the algorithm learns and adapts its strategy over time!</p>
					<Button onClick={() => setOpen(false)} className="max-w-min mt-3 self-center">
						Start
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
