// src/components/Header.tsx
import AuthStatus from "./AuthStatus.client";
import Link from "next/link";

export default function Header({ title }: { title?: string }) {
	return (
		<header className="fixed top-0 left-0 w-full bg-gray-800 text-white py-3 px-4 z-50 shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<div className="flex items-center space-x-3">
					<Link href="/" className="flex items-center space-x-3 hover:text-gray-300 transition-colors">
						{/* Cloud icon */}
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
							/>
						</svg>
						<h1 className="text-xl font-semibold tracking-wide">
							{title || "EchoCloud"}
						</h1>
					</Link>
				</div>
				<AuthStatus />
			</div>
		</header>
	);
}
