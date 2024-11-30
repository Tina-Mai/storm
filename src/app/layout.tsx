import type { Metadata } from "next";
import { GlobalProvider } from "@/context/globalContext";
import localFont from "next/font/local";
import "./globals.css";

const anotherSans = localFont({
	src: [
		{
			path: "../assets/font/another-sans/another-sans.woff2",
			weight: "100 900",
			style: "normal",
		},
		{
			path: "../assets/font/another-sans/another-sans.woff",
			weight: "100 900",
			style: "normal",
		},
		{
			path: "../assets/font/another-sans/another-sans.ttf",
			weight: "100 900",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-another-sans",
});

export const metadata: Metadata = {
	title: "Storm",
	description: "Optimizing disaster resource allocation in multi-armed bandit problems",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${anotherSans.className}`}>
				<GlobalProvider>{children}</GlobalProvider>
			</body>
		</html>
	);
}
