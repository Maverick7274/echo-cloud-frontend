"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit2, Eye, Clock } from "lucide-react";
import { fetchCapsules } from "../../slices/capsuleSlice";

export default function DashboardPage() {
	const { isAuthenticated, initialized } = useSelector(
		(state: RootState) => state.auth
	);
	const { capsules, loading, error } = useSelector(
		(state: RootState) => state.capsules
	);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	useEffect(() => {
		if (initialized && !isAuthenticated) {
			router.push("/login");
		}
	}, [initialized, isAuthenticated, router]);

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(fetchCapsules());
		}
	}, [isAuthenticated, dispatch]);

	if (!initialized || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900">
				<div className="flex flex-col items-center">
					<div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
					<p className="text-gray-300">Loading your capsules...</p>
				</div>
			</div>
		);
	}
	
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900">
				<div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md text-center">
					<div className="text-red-500 text-5xl mb-4">!</div>
					<h3 className="text-xl font-bold text-gray-200 mb-2">Error Loading Capsules</h3>
					<p className="text-red-400">{error}</p>
					<button 
						onClick={() => dispatch(fetchCapsules())}
						className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-200 pt-22">
			<div className="container mx-auto p-6">
				<div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
					<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Your Time Capsules</h2>
					<Link
						href="/capsules/create"
						className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md"
					>
						<Plus size={20} className="mr-2" /> Create Capsule
					</Link>
				</div>
				
				{capsules && capsules.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{capsules.map((capsule) => (
							<div
								key={capsule._id}
								className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-all flex flex-col h-full"
							>
								<h3 className="text-xl font-bold mb-2 text-white">
									{capsule.title}
								</h3>
								<p className="text-gray-300 mb-4 flex-grow">{capsule.description}</p>
								<div className="flex items-center mb-4 text-sm text-gray-400">
									<Clock size={16} className="mr-2" />
									<span>Unlocks: {new Date(capsule.unlockDate).toLocaleDateString()}</span>
								</div>
								<div className="flex space-x-3 pt-3 border-t border-gray-700">
									<Link
										href={`/capsules/${capsule._id}`}
										className="flex items-center text-blue-500 hover:text-blue-400 transition-colors"
									>
										<Eye size={18} className="mr-1" /> View
									</Link>
									<Link
										href={`/capsules/${capsule._id}/edit`}
										className="flex items-center text-green-500 hover:text-green-400 transition-colors"
									>
										<Edit2 size={18} className="mr-1" /> Edit
									</Link>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="bg-gray-800 rounded-lg p-8 text-center shadow-lg border border-gray-700">
						<div className="text-5xl mb-4 opacity-70">🕰️</div>
						<h3 className="text-xl font-bold mb-3">No Time Capsules Found</h3>
						<p className="text-gray-400 mb-6">
							Create your first time capsule to start preserving your memories.
						</p>
						<Link
							href="/capsules/create"
							className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
						>
							<Plus size={18} className="mr-2" /> Create Your First Capsule
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
