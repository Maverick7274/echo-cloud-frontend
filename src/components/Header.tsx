// src/components/Header.tsx
import AuthStatus from "./AuthStatus.client";

export default function Header({ title }: { title?: string }) {
	return (
		<header className="bg-gray-800 text-white p-4">
			<div className="container mx-auto flex justify-between items-center">
				<h1>{title || "EchoCloud"}</h1>
				<AuthStatus />
			</div>
		</header>
	);
}
