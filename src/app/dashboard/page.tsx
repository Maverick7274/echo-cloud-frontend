"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit2, Eye } from "lucide-react";
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
			<div className="min-h-screen flex items-center justify-center">
				Loading...
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

	return (
		<div className="min-h-screen flex flex-col">
			<div className="container mx-auto p-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold">Your Time Capsules</h2>
					<Link
						href="/capsules/create"
						className="flex items-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
					>
						<Plus size={20} className="mr-2" /> Create Capsule
					</Link>
				</div>
				{capsules && capsules.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
						{capsules.map((capsule) => (
							<div
								key={capsule._id}
								className="bg-white p-4 rounded shadow flex flex-col"
							>
								<h3 className="text-xl font-bold">
									{capsule.title}
								</h3>
								<p>{capsule.description}</p>
								<p className="text-sm text-gray-500">
									Unlock Date:{" "}
									{new Date(
										capsule.unlockDate
									).toLocaleDateString()}
								</p>
								<div className="mt-auto flex space-x-2">
									<Link
										href={`/capsules/${capsule._id}`}
										className="flex items-center text-blue-500 hover:underline"
									>
										<Eye size={18} className="mr-1" /> View
									</Link>
									<Link
										href={`/capsules/${capsule._id}/edit`}
										className="flex items-center text-green-500 hover:underline"
									>
										<Edit2 size={18} className="mr-1" />{" "}
										Edit
									</Link>
								</div>
							</div>
						))}
					</div>
				) : (
					<p>
						No time capsules found. Create one to start preserving
						your memories.
					</p>
				)}
			</div>
		</div>
	);
}
