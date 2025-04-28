// app/components/AuthStatus.client.tsx
"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { clearAuth } from "@/slices/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AuthStatus() {
	const dispatch = useDispatch();
	const router = useRouter();
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);
	const user = useSelector((state: RootState) => state.auth.user);

	const handleLogout = async () => {
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/logout`,
				{},
				{ withCredentials: true }
			);
			dispatch(clearAuth());
			router.push("/login");
		} catch (error) {
			console.error("Logout failed", error);
		}
	};

	return (
		<div className="bg-gray-900 p-4 rounded-lg shadow-md">
			{isAuthenticated && (
				<div className="flex items-center justify-between">
					<div className="text-white mr-4">
						{user?.name || "User"}{" "}
						<span className="text-gray-400 text-sm">• Online</span>
					</div>
					<button
						onClick={handleLogout}
						className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-red-700/30"
					>
						<LogOut size={16} />
						<span>Logout</span>
					</button>
				</div>
			)}
		</div>
	);
}
