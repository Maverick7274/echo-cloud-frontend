/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, setLoading } from "../../slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState } from "../../store";
import Link from "next/link";

type RegisterFormInputs = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	dateOfBirth?: string;
};

export default function RegisterPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormInputs>();
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

	const onSubmit = async (data: RegisterFormInputs) => {
		if (data.password !== data.confirmPassword) {
			setErrorMsg("Passwords do not match");
			return;
		}
		try {
			dispatch(setLoading(true));
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/register`,
				data,
				{ withCredentials: true }
			);
			if (response.data.success) {
				dispatch(setAuth({ user: response.data.data }));
				router.push("/dashboard");
			} else {
				setErrorMsg(response.data.message || "Registration failed");
			}
		} catch (error: any) {
			setErrorMsg(error.response?.data?.message || "Registration error");
		} finally {
			dispatch(setLoading(false));
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 pt-16">
			<div className="w-full max-w-md px-6 py-8">
				<div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
					<div className="px-8 pt-8 pb-6">
						<h1 className="text-3xl font-bold text-center mb-2">
							Create Account
						</h1>
						<p className="text-gray-400 text-center mb-8">
							Join us today and start your journey
						</p>

						{errorMsg && (
							<div className="mb-6 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-400">
								{errorMsg}
							</div>
						)}

						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="space-y-5">
								<div>
									<label className="block text-sm font-medium mb-1">
										Name
									</label>
									<input
										type="text"
										{...register("name", {
											required: "Name is required",
										})}
										className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
										placeholder="Your full name"
									/>
									{errors.name && (
										<p className="mt-1 text-red-400 text-sm">
											{errors.name.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Email
									</label>
									<input
										type="email"
										{...register("email", {
											required: "Email is required",
										})}
										className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
										placeholder="your.email@example.com"
									/>
									{errors.email && (
										<p className="mt-1 text-red-400 text-sm">
											{errors.email.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Password
									</label>
									<input
										type="password"
										{...register("password", {
											required: "Password is required",
											minLength: {
												value: 6,
												message: "Minimum 6 characters",
											},
										})}
										className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
										placeholder="••••••••"
									/>
									{errors.password && (
										<p className="mt-1 text-red-400 text-sm">
											{errors.password.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Confirm Password
									</label>
									<input
										type="password"
										{...register("confirmPassword", {
											required:
												"Confirm password is required",
										})}
										className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
										placeholder="••••••••"
									/>
									{errors.confirmPassword && (
										<p className="mt-1 text-red-400 text-sm">
											{errors.confirmPassword.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Date of Birth
									</label>
									<input
										type="date"
										{...register("dateOfBirth")}
										className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
									/>
								</div>

								<button
									type="submit"
									className="w-full bg-green-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 mt-6"
								>
									Register
								</button>

								<p className="text-center text-gray-400 text-sm mt-6">
									Already have an account?
									<Link
										href="/login"
										className="text-green-400 hover:text-green-300 ml-1"
									>
										Sign in
									</Link>
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
