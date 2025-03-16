// app/components/AuthStatus.client.tsx
"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { clearAuth } from "@/slices/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AuthStatus() {
	const dispatch = useDispatch();
	const router = useRouter();
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);

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
		<div>
			{isAuthenticated && (
				<button
					onClick={handleLogout}
					className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
				>
					Logout
				</button>
			)}
		</div>
	);
}
