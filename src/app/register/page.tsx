/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, setLoading } from "../../slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState } from "../../store";

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

	// Redirect if the user is already authenticated
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
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="bg-white p-6 rounded shadow-md w-full max-w-md"
			>
				<h2 className="text-2xl mb-4">Register</h2>
				{errorMsg && <p className="text-red-500">{errorMsg}</p>}
				<div className="mb-4">
					<label className="block mb-1">Name</label>
					<input
						type="text"
						{...register("name", { required: "Name is required" })}
						className="w-full border p-2 rounded"
					/>
					{errors.name && (
						<p className="text-red-500 text-sm">
							{errors.name.message}
						</p>
					)}
				</div>
				<div className="mb-4">
					<label className="block mb-1">Email</label>
					<input
						type="email"
						{...register("email", {
							required: "Email is required",
						})}
						className="w-full border p-2 rounded"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">
							{errors.email.message}
						</p>
					)}
				</div>
				<div className="mb-4">
					<label className="block mb-1">Password</label>
					<input
						type="password"
						{...register("password", {
							required: "Password is required",
							minLength: {
								value: 6,
								message: "Minimum 6 characters",
							},
						})}
						className="w-full border p-2 rounded"
					/>
					{errors.password && (
						<p className="text-red-500 text-sm">
							{errors.password.message}
						</p>
					)}
				</div>
				<div className="mb-4">
					<label className="block mb-1">Confirm Password</label>
					<input
						type="password"
						{...register("confirmPassword", {
							required: "Confirm password is required",
						})}
						className="w-full border p-2 rounded"
					/>
					{errors.confirmPassword && (
						<p className="text-red-500 text-sm">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>
				<div className="mb-4">
					<label className="block mb-1">Date of Birth</label>
					<input
						type="date"
						{...register("dateOfBirth")}
						className="w-full border p-2 rounded"
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
				>
					Register
				</button>
			</form>
		</div>
	);
}
