// app/components/GlobalLoader.client.tsx
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GlobalLoader({ loading }: { loading: boolean }) {
	const loaderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (loading && loaderRef.current) {
			gsap.to(loaderRef.current, { autoAlpha: 1, duration: 0.5 });
		} else if (!loading && loaderRef.current) {
			gsap.to(loaderRef.current, { autoAlpha: 0, duration: 0.5 });
		}
	}, [loading]);

	return (
		<div
			ref={loaderRef}
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none"
			style={{ opacity: 0 }}
		>
			<div className="loader">
				<div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
			</div>
		</div>
	);
}
