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
			<div className="min-h-screen flex items-center justify-center">
				Loading capsule data...
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
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-black">
			<form
				onSubmit={handleSubmit(onSubmitHandler)}
				className="bg-white p-6 rounded shadow-md w-full max-w-lg"
			>
				<h2 className="text-2xl mb-4">Edit Time Capsule</h2>
				{errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
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
				<div className="mb-4">
					<label className="block mb-1">Description</label>
					<textarea
						{...register("description")}
						className="w-full border p-2 rounded"
					/>
				</div>
				<div className="mb-4">
					<label className="block mb-1">Unlock Date</label>
					<input
						type="date"
						{...register("unlockDate", {
							required: "Unlock Date is required",
						})}
						className="w-full border p-2 rounded"
					/>
					{errors.unlockDate && (
						<p className="text-red-500 text-sm">
							{errors.unlockDate.message}
						</p>
					)}
				</div>
				<div className="mb-4 flex items-center">
					<input
						type="checkbox"
						{...register("isPrivate")}
						className="mr-2"
					/>
					<label>Private Capsule</label>
				</div>
				<div className="mb-4">
					<label className="block mb-1">Existing Media</label>
					{currentCapsule.mediaFiles &&
					currentCapsule.mediaFiles.length > 0 ? (
						<div className="grid grid-cols-2 gap-2">
							{currentCapsule.mediaFiles.map((media, index) => (
								<div key={index} className="border p-2">
									{media.type === "photo" ? (
										<Image
											src={media.url}
											alt={media.fileName}
                                            width={500}
                                            height={300}
										/>
									) : media.type === "video" ? (
										<video
											controls
											src={media.url}
											className="w-full h-auto"
										/>
									) : media.type === "audio" ? (
										<audio
											controls
											src={media.url}
											className="w-full"
										/>
									) : null}
									<p className="text-xs text-center">
										{media.fileName}
									</p>
								</div>
							))}
						</div>
					) : (
						<p>No media uploaded yet.</p>
					)}
				</div>
				<div className="mb-4">
					<label className="block mb-1">Upload New Media</label>
					<div
						{...getRootProps()}
						className="border-dashed border-2 p-4 text-center cursor-pointer"
					>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p>Drop the files here...</p>
						) : (
							<p>
								Drag &#39;n&#39; drop files here, or click to select
								files
							</p>
						)}
					</div>
					{files.length > 0 && (
						<div className="mt-2">
							<p className="font-bold">New Files:</p>
							<ul>
								{files.map((file, index) => (
									<li key={index} className="text-sm">
										{file.name}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
				<div className="flex justify-between">
					<button
						type="submit"
						className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
					>
						Update Capsule
					</button>
					<button
						type="button"
						onClick={handleDelete}
						className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
					>
						Delete Capsule
					</button>
				</div>
			</form>
		</div>
	);
}
