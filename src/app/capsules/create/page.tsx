"use client";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createCapsule } from "@/slices/capsuleSlice";

type CreateCapsuleFormInputs = {
	title: string;
	description?: string;
	unlockDate: string;
	isPrivate?: boolean;
};

export default function CreateCapsulePage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateCapsuleFormInputs>();
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const { isAuthenticated, initialized } = useSelector(
		(state: RootState) => state.auth
	);
	const [errorMsg, setErrorMsg] = useState("");
	const [files, setFiles] = useState<File[]>([]);

	// On mount, redirect if not authenticated
	useEffect(() => {
		if (initialized && !isAuthenticated) {
			router.push("/login");
		}
	}, [initialized, isAuthenticated, router]);

	// Use react-dropzone to select or drag in files
	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles((prev) => [...prev, ...acceptedFiles]);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [],
			"video/*": [],
			"audio/*": [],
		},
	});

	// On submit, create FormData
	const onSubmitHandler = async (data: CreateCapsuleFormInputs) => {
		try {
			// The value of unlockDate is expected to be in YYYY-MM-DD format.
			const formData = new FormData();
			formData.append("title", data.title);
			formData.append("description", data.description || "");
			formData.append("unlockDate", data.unlockDate);
			formData.append("isPrivate", data.isPrivate ? "true" : "false");

			// Append files; backend will extract metadata automatically.
			files.forEach((file) => {
				formData.append("mediaFiles", file);
			});

			await dispatch(createCapsule(formData)).unwrap();
			router.push("/dashboard");
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMsg(error.message);
			} else {
				setErrorMsg(String(error));
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 pt-22">
			<form
				onSubmit={handleSubmit(onSubmitHandler)}
				className="bg-gray-800 p-6 rounded shadow-md w-full max-w-lg"
			>
				<h2 className="text-2xl mb-4">Create Time Capsule</h2>
				{errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

				{/* Title */}
				<div className="mb-4">
					<label className="block mb-1">Title</label>
					<input
						type="text"
						{...register("title", {
							required: "Title is required",
						})}
						className="w-full border p-2 rounded"
					/>
					{errors.title && (
						<p className="text-red-500 text-sm">
							{errors.title.message}
						</p>
					)}
				</div>

				{/* Description */}
				<div className="mb-4">
					<label className="block mb-1">Description</label>
					<textarea
						{...register("description")}
						className="w-full border p-2 rounded"
					/>
				</div>

				{/* Unlock Date */}
				<div className="mb-4">
					<label className="block mb-1">Unlock Date</label>
					<input
						type="date"
						{...register("unlockDate", {
							required: "Unlock Date is required",
						})}
						placeholder="YYYY-MM-DD"
						pattern="^\d{4}-\d{2}-\d{2}$"
						className="w-full border p-2 rounded"
					/>

					{errors.unlockDate && (
						<p className="text-red-500 text-sm">
							{errors.unlockDate.message}
						</p>
					)}
				</div>

				{/* Private Capsule */}
				<div className="mb-4 flex items-center">
					<input
						type="checkbox"
						{...register("isPrivate")}
						className="mr-2"
					/>
					<label>Private Capsule</label>
				</div>

				{/* Dropzone */}
				<div className="mb-4">
					<label className="block mb-1">
						Upload Media (Photos, Videos, Audios)
					</label>
					<div
						{...getRootProps()}
						className="border-dashed border-2 p-4 text-center cursor-pointer"
					>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p>Drop the files here...</p>
						) : (
							<p>
								Drag &#39;n&#39; drop files here, or click to
								select files
							</p>
						)}
					</div>

					{/* Show selected file metadata */}
					{files.length > 0 && (
						<div className="mt-2">
							<p className="font-bold">Selected Files:</p>
							<ul>
								{files.map((file, index) => (
									<li key={index} className="text-sm">
										<strong>Name:</strong> {file.name} |{" "}
										<strong>Size:</strong> {file.size} bytes
										| <strong>Type:</strong> {file.type}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>

				{/* Submit */}
				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
				>
					Create Capsule
				</button>
			</form>
		</div>
	);
}
