// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import capsuleReducer from "./slices/capsuleSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		capsules: capsuleReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
