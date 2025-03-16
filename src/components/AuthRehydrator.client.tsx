// src/components/AuthRehydrator.client.tsx
"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAuth, setInitialized, clearAuth } from "../slices/authSlice";

export default function AuthRehydrator() {
	const dispatch = useDispatch();

	useEffect(() => {
		async function rehydrateAuth() {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/validate-token`,
					{ withCredentials: true }
				);
				if (response.data.success) {
					// If token is valid, update the auth state
					dispatch(setAuth({ user: response.data.data }));
				}
			} catch (error: unknown) {
				if (axios.isAxiosError(error)) {
					if (error.response && error.response.status === 401) {
						// Token is invalid or expired (user logged out)
						dispatch(clearAuth());
					} else {
						console.error("Token validation error:", error);
					}
				} else {
					console.error(
						"Unexpected error during token validation:",
						error
					);
				}
			} finally {
				// In every case, mark rehydration as complete
				dispatch(setInitialized(true));
			}
		}
		rehydrateAuth();
	}, [dispatch]);

	return null;
}
