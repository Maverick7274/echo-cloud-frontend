"use client";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../store";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
	fetchCapsuleById,
	updateCapsule,
	deleteCapsule,
	clearCurrentCapsule,
} from "../../../../slices/capsuleSlice";
import Image from "next/image";

type EditCapsuleFormInputs = {
	title: string;
	description?: string;
	unlockDate: string;
	isPrivate?: boolean;
};

export default function EditCapsulePage() {
	const { id } = useParams() as { id: string };
	const { isAuthenticated, initialized } = useSelector(
		(state: RootState) => state.auth
	);
	const { currentCapsule, loading, error } = useSelector(
		(state: RootState) => state.capsules
	);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const [errorMsg, setErrorMsg] = useState("");
	const [files, setFiles] = useState<File[]>([]);

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

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<EditCapsuleFormInputs>();

	useEffect(() => {
		if (currentCapsule) {
			reset({
				title: currentCapsule.title,
				description: currentCapsule.description,
				unlockDate: new Date(currentCapsule.unlockDate)
					.toISOString()
					.split("T")[0],
				isPrivate: currentCapsule.isPrivate,
			});
		}
	}, [currentCapsule, reset]);

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

	const onSubmitHandler = async (data: EditCapsuleFormInputs) => {
		try {
			const formData = new FormData();
			formData.append("title", data.title);
			formData.append("description", data.description || "");
			formData.append("unlockDate", data.unlockDate);
			formData.append("isPrivate", data.isPrivate ? "true" : "false");
			files.forEach((file) => {
				formData.append("mediaFiles", file);
			});
			await dispatch(updateCapsule({ id, formData })).unwrap();
			router.push("/dashboard");
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMsg(error.message);
			} else {
				setErrorMsg(String(error));
			}
		}
	};

	const handleDelete = async () => {
		try {
			await dispatch(deleteCapsule(id)).unwrap();
			router.push("/dashboard");
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMsg(error.message);
			} else {
				setErrorMsg(String(error));
			}
		}
	};

	if (loading || !currentCapsule) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
				<div className="animate-pulse flex items-center space-x-2">
					<div className="h-4 w-4 bg-blue-500 rounded-full"></div>
					<span>Loading capsule data...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
				<div className="bg-gray-800 p-6 rounded-lg shadow-lg">
					<h2 className="text-xl mb-2">Error</h2>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6 pt-28 text-gray-100">
			<div className="w-full max-w-3xl">
				<h1 className="text-3xl font-bold mb-8 text-center">
					Edit Time Capsule
				</h1>

				<form
					onSubmit={handleSubmit(onSubmitHandler)}
					className="bg-gray-800 p-8 rounded-lg shadow-xl"
				>
					{errorMsg && (
						<div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-md text-red-300">
							{errorMsg}
						</div>
					)}

					<div className="grid gap-6 mb-8">
						<div>
							<label className="block mb-2 font-medium">
								Title
							</label>
							<input
								type="text"
								{...register("title", {
									required: "Title is required",
								})}
								className="w-full bg-gray-700 border border-gray-600 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							/>
							{errors.title && (
								<p className="text-red-400 text-sm mt-1">
									{errors.title.message}
								</p>
							)}
						</div>

						<div>
							<label className="block mb-2 font-medium">
								Description
							</label>
							<textarea
								{...register("description")}
								rows={4}
								className="w-full bg-gray-700 border border-gray-600 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							/>
						</div>

						<div>
							<label className="block mb-2 font-medium">
								Unlock Date
							</label>
							<input
								type="date"
								{...register("unlockDate", {
									required: "Unlock Date is required",
								})}
								className="w-full bg-gray-700 border border-gray-600 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							/>
							{errors.unlockDate && (
								<p className="text-red-400 text-sm mt-1">
									{errors.unlockDate.message}
								</p>
							)}
						</div>

						<div className="flex items-center">
							<input
								type="checkbox"
								{...register("isPrivate")}
								className="w-5 h-5 bg-gray-700 border-gray-600 rounded mr-3 focus:ring-blue-500"
							/>
							<label className="font-medium">
								Private Capsule
							</label>
						</div>
					</div>

					<div className="mb-6">
						<h3 className="text-xl font-medium mb-4 border-b border-gray-700 pb-2">
							Existing Media
						</h3>
						{currentCapsule.mediaFiles &&
						currentCapsule.mediaFiles.length > 0 ? (
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{currentCapsule.mediaFiles.map(
									(media, index) => (
										<div
											key={index}
											className="bg-gray-700 rounded-lg overflow-hidden"
										>
											<div className="aspect-video relative">
												{media.type === "photo" ? (
													<Image
														src={media.url}
														alt={media.fileName}
														fill
														className="object-cover"
													/>
												) : media.type === "video" ? (
													<video
														controls
														src={media.url}
														className="w-full h-full object-cover"
													/>
												) : media.type === "audio" ? (
													<div className="w-full h-full flex items-center justify-center bg-gray-600">
														<audio
															controls
															src={media.url}
															className="w-11/12"
														/>
													</div>
												) : null}
											</div>
											<div className="p-2 truncate text-xs text-center">
												{media.fileName}
											</div>
										</div>
									)
								)}
							</div>
						) : (
							<p className="text-gray-400 italic">
								No media uploaded yet.
							</p>
						)}
					</div>

					<div className="mb-8">
						<h3 className="text-xl font-medium mb-4 border-b border-gray-700 pb-2">
							Upload New Media
						</h3>
						<div
							{...getRootProps()}
							className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
								isDragActive
									? "border-blue-500 bg-blue-500/10"
									: "border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
							}`}
						>
							<input {...getInputProps()} />
							<div className="flex flex-col items-center">
								<svg
									className="w-12 h-12 mb-3 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
									></path>
								</svg>
								{isDragActive ? (
									<p className="text-blue-300">
										Drop files here
									</p>
								) : (
									<div>
										<p className="mb-2">
											Drag and drop files here, or click
											to browse
										</p>
										<p className="text-sm text-gray-400">
											Supports images, videos, and audio
											files
										</p>
									</div>
								)}
							</div>
						</div>

						{files.length > 0 && (
							<div className="mt-4 p-4 bg-gray-700 rounded-md">
								<p className="font-medium mb-2">
									New Files ({files.length})
								</p>
								<ul className="max-h-40 overflow-y-auto">
									{files.map((file, index) => (
										<li
											key={index}
											className="text-sm py-1 border-b border-gray-600 last:border-0 flex items-center"
										>
											<span className="w-5 h-5 mr-2 flex-shrink-0">
												<svg
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
													></path>
												</svg>
											</span>
											{file.name}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					<div className="flex flex-col sm:flex-row justify-between gap-4">
						<button
							type="submit"
							className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800"
						>
							Update Capsule
						</button>
						<button
							type="button"
							onClick={handleDelete}
							className="bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition-colors focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-gray-800"
						>
							Delete Capsule
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
