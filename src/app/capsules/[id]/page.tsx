"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { useRouter, useParams } from "next/navigation";
import { fetchCapsuleById, clearCurrentCapsule } from "@/slices/capsuleSlice";
import Link from "next/link";
import Image from "next/image";
import { Calendar, PenSquare } from "lucide-react";

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
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
				<div className="flex flex-col items-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
					<p className="text-lg">Loading your time capsule...</p>
				</div>
			</div>
		);
	}
	
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900">
				<div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-red-500 text-white">
					<h2 className="text-xl mb-2 font-semibold">Error</h2>
					<p className="text-red-400">{error}</p>
					<button 
						onClick={() => router.push("/capsules")}
						className="mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200"
					>
						Back to Capsules
					</button>
				</div>
			</div>
		);
	}

	const capsule = currentCapsule;

	return (
		<div className="min-h-screen bg-gray-900 text-white py-12 px-4 pt-28">
			<div className="max-w-4xl mx-auto">
				<div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
					<div className="p-6 md:p-8">
						<h2 className="text-3xl font-bold mb-2 text-blue-400">{capsule.title}</h2>
						<p className="text-gray-300 mb-4 text-lg">{capsule.description}</p>
						
						<div className="flex items-center space-x-2 text-gray-400 mb-8">
							<Calendar className="text-blue-500" size={18} />
							<span>Unlocks on: </span>
							<span className="font-medium text-white">
								{new Date(capsule.unlockDate).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</span>
						</div>
						
						<div className="mt-8">
							<h3 className="text-xl font-semibold mb-4 inline-block pb-2 border-b-2 border-blue-500">Media Files</h3>
							
							{capsule.mediaFiles && capsule.mediaFiles.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
									{capsule.mediaFiles.map((media, index) => (
										<div key={index} className="bg-gray-700 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-102 hover:shadow-lg">
											<div className="aspect-w-16 aspect-h-9 relative">
												{media.type === "photo" ? (
													<Image
														src={media.url}
														alt={media.fileName}
														width={500}
														height={300}
														className="object-cover w-full h-full rounded-t-lg"
													/>
												) : media.type === "video" ? (
													<video
														controls
														src={media.url}
														className="w-full h-full object-cover"
													/>
												) : media.type === "audio" ? (
													<div className="flex items-center justify-center h-full bg-gray-600 p-4">
														<audio
															controls
															src={media.url}
															className="w-full"
														/>
													</div>
												) : null}
											</div>
											<div className="p-3">
												<p className="text-sm text-gray-300 truncate">
													{media.fileName}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="bg-gray-700 rounded-lg p-8 text-center">
									<p className="text-gray-400">No media files in this time capsule.</p>
								</div>
							)}
						</div>
						
						<div className="mt-8 flex justify-end">
							<Link
								href={`/capsules/${capsule._id}/edit`}
								className="bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 transition duration-200 flex items-center space-x-2"
							>
								<PenSquare size={18} />
								<span>Edit Capsule</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
