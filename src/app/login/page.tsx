"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, setLoading } from "../../slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState } from "../../store";
import Link from "next/link";

type LoginFormInputs = {
	email: string;
	password: string;
};

export default function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>();
	const dispatch = useDispatch();
	const router = useRouter();
	const { isAuthenticated, initialized } = useSelector(
		(state: RootState) => state.auth
	);
	const [errorMsg, setErrorMsg] = useState("");

	useEffect(() => {
		if (initialized && isAuthenticated) {
			router.push("/dashboard");
		}
	}, [initialized, isAuthenticated, router]);

	const onSubmit = async (data: LoginFormInputs) => {
		try {
			dispatch(setLoading(true));
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`,
				data,
				{ withCredentials: true }
			);
			if (response.data.success) {
				dispatch(setAuth({ user: response.data.data }));
				router.push("/dashboard");
			} else {
				setErrorMsg(response.data.message || "Login failed");
			}
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				setErrorMsg(error.response?.data?.message || "Login error");
			} else {
				setErrorMsg("Login error");
			}
		} finally {
			dispatch(setLoading(false));
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
			<div className="w-full max-w-md px-8 py-10">
				<div className="bg-gray-800 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
						<p className="text-gray-400">Sign in to your account</p>
					</div>
					
					{errorMsg && (
						<div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
							{errorMsg}
						</div>
					)}
					
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-5">
							<label className="block mb-2 text-sm font-medium">Email</label>
							<input
								type="email"
								{...register("email", { required: "Email is required" })}
								className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								placeholder="your@email.com"
							/>
							{errors.email && (
								<p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
							)}
						</div>
						
						<div className="mb-6">
							<label className="block mb-2 text-sm font-medium">Password</label>
							<input
								type="password"
								{...register("password", { required: "Password is required" })}
								className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								placeholder="••••••••"
							/>
							{errors.password && (
								<p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
							)}
						</div>
						
						<button
							type="submit"
							className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg"
						>
							Sign In
						</button>
					</form>
					
					<div className="mt-6 text-center text-gray-400 text-sm">
						<p>Don&apos;t have an account? <Link href="/register" className="text-blue-400 hover:underline">Sign up</Link></p>
					</div>
				</div>
			</div>
		</div>
	);
}
