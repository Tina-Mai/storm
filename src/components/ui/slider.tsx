"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
		<SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
			<SliderPrimitive.Range className="absolute h-full bg-slate-800 dark:bg-slate-50" />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className="block size-4 rounded-full border-[1.5px] border-slate-800 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-none" />
	</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
