/* eslint-disable @typescript-eslint/no-explicit-any */
// src/slices/capsuleSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type MediaFile = {
	url: string;
	type: "video" | "audio" | "photo";
	fileName: string;
	fileSize: number;
	mimeType: string;
};

export type Capsule = {
	_id: string;
	title: string;
	description?: string;
	unlockDate: string;
	isPrivate: boolean;
	mediaFiles?: MediaFile[];
};

interface CapsuleState {
	capsules: Capsule[];
	currentCapsule: Capsule | null;
	loading: boolean;
	error: string | null;
}

const initialState: CapsuleState = {
	capsules: [],
	currentCapsule: null,
	loading: false,
	error: null,
};

export const fetchCapsules = createAsyncThunk(
	"capsules/fetchAll",
	async (_, thunkAPI) => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/capsules`,
				{ withCredentials: true }
			);
			return response.data.data as Capsule[];
		} catch (error: any) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.message || "Error fetching capsules"
			);
		}
	}
);

export const fetchCapsuleById = createAsyncThunk(
	"capsules/fetchById",
	async (id: string, thunkAPI) => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/capsules/${id}`,
				{ withCredentials: true }
			);
			return response.data.data as Capsule;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.message || "Error fetching capsule"
			);
		}
	}
);

export const createCapsule = createAsyncThunk(
	"capsules/create",
	async (formData: FormData, thunkAPI) => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/capsules`,
				formData,
				{
					withCredentials: true,
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			return response.data.data as Capsule;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.message || "Error creating capsule"
			);
		}
	}
);

export const updateCapsule = createAsyncThunk(
	"capsules/update",
	async ({ id, formData }: { id: string; formData: FormData }, thunkAPI) => {
		try {
			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/capsules/${id}`,
				formData,
				{
					withCredentials: true,
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			return response.data.data as Capsule;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.message || "Error updating capsule"
			);
		}
	}
);

export const deleteCapsule = createAsyncThunk(
	"capsules/delete",
	async (id: string, thunkAPI) => {
		try {
			await axios.delete(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/capsules/${id}`,
				{
					withCredentials: true,
				}
			);
			return id;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.message || "Error deleting capsule"
			);
		}
	}
);

const capsuleSlice = createSlice({
	name: "capsules",
	initialState,
	reducers: {
		clearCurrentCapsule(state) {
			state.currentCapsule = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// fetchCapsules
			.addCase(fetchCapsules.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchCapsules.fulfilled,
				(state, action: PayloadAction<Capsule[]>) => {
					state.loading = false;
					state.capsules = action.payload;
				}
			)
			.addCase(
				fetchCapsules.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error = action.payload;
				}
			)
			// fetchCapsuleById
			.addCase(fetchCapsuleById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchCapsuleById.fulfilled,
				(state, action: PayloadAction<Capsule>) => {
					state.loading = false;
					state.currentCapsule = action.payload;
				}
			)
			.addCase(
				fetchCapsuleById.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error = action.payload;
				}
			)
			// createCapsule
			.addCase(createCapsule.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				createCapsule.fulfilled,
				(state, action: PayloadAction<Capsule>) => {
					state.loading = false;
					state.capsules.push(action.payload);
				}
			)
			.addCase(
				createCapsule.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error = action.payload;
				}
			)
			// updateCapsule
			.addCase(updateCapsule.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				updateCapsule.fulfilled,
				(state, action: PayloadAction<Capsule>) => {
					state.loading = false;
					state.capsules = state.capsules.map((capsule) =>
						capsule._id === action.payload._id
							? action.payload
							: capsule
					);
					if (
						state.currentCapsule &&
						state.currentCapsule._id === action.payload._id
					) {
						state.currentCapsule = action.payload;
					}
				}
			)
			.addCase(
				updateCapsule.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error = action.payload;
				}
			)
			// deleteCapsule
			.addCase(deleteCapsule.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				deleteCapsule.fulfilled,
				(state, action: PayloadAction<string>) => {
					state.loading = false;
					state.capsules = state.capsules.filter(
						(capsule) => capsule._id !== action.payload
					);
				}
			)
			.addCase(
				deleteCapsule.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error = action.payload;
				}
			);
	},
});

export const { clearCurrentCapsule } = capsuleSlice.actions;
export default capsuleSlice.reducer;
