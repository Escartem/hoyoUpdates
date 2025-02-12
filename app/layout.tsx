import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
	title: "HoyoUpdates",
	description: "Utility to get update packages from hoyo games",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
					<div className="w-full h-full font-[ProductSans]">
						{children}
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
