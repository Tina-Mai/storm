import type { Metadata } from "next";
import { GlobalProvider } from "@/context/globalContext";
import "./globals.css";

export const metadata: Metadata = {
	title: "STORM",
	description: "Statistical Tools for Optimizing Resource Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<GlobalProvider>{children}</GlobalProvider>
			</body>
		</html>
	);
}
