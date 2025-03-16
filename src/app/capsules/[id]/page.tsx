"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { useRouter, useParams } from "next/navigation";
import { fetchCapsuleById, clearCurrentCapsule } from "@/slices/capsuleSlice";
import Link from "next/link";
import Image from "next/image";

export default function ViewCapsulePage() {
	const { id } = useParams() as { id: string };
	const { isAuthenticated, initialized } = useSelector(
		(state: RootState) => state.auth
	);
	const { currentCapsule, loading, error } = useSelector(
		(state: RootState) => state.capsules
	);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	useEffect(() => {
		if (initialized && !isAuthenticated) {
			router.push("/login");
		} else if (isAuthenticated && id) {
			dispatch(fetchCapsuleById(id));
		}
		return () => {
			dispatch(clearCurrentCapsule());
		};
	}, [initialized, isAuthenticated, id, dispatch, router]);

	if (loading || !currentCapsule) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading capsule...
			</div>
		);
	}
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center text-red-500">
				{error}
			</div>
		);
	}

	const capsule = currentCapsule;

	return (
		<div className="min-h-screen p-4 bg-gray-100 text-black">
			<div className="container mx-auto bg-white p-6 rounded shadow">
				<h2 className="text-2xl mb-4">{capsule.title}</h2>
				<p>{capsule.description}</p>
				<p className="text-sm text-gray-500">
					Unlock Date:{" "}
					{new Date(capsule.unlockDate).toLocaleDateString()}
				</p>
				<div className="mt-4">
					<h3 className="text-xl mb-2">Media Files</h3>
					{capsule.mediaFiles && capsule.mediaFiles.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{capsule.mediaFiles.map((media, index) => (
								<div key={index} className="border p-2">
									{media.type === "photo" ? (
										<Image
											src={media.url}
											alt={media.fileName}
											width={500}
											height={300}
											className="object-cover"
										/>
									) : media.type === "video" ? (
										<video
											controls
											src={media.url}
											className="w-full h-auto"
										/>
									) : media.type === "audio" ? (
										<audio
											controls
											src={media.url}
											className="w-full"
										/>
									) : null}
									<p className="text-xs text-center">
										{media.fileName}
									</p>
								</div>
							))}
						</div>
					) : (
						<p>No media available.</p>
					)}
				</div>
				<div className="mt-4">
					<Link
						href={`/capsules/${capsule._id}/edit`}
						className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
					>
						Edit Capsule
					</Link>
				</div>
			</div>
		</div>
	);
}
