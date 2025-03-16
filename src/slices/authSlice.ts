import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
	isAuthenticated: boolean;
	user?: { id: string; name: string; email: string };
	loading: boolean;
	initialized: boolean;
}

const initialState: AuthState = {
	isAuthenticated: false,
	loading: true, // start in loading state
	initialized: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuth(
			state,
			action: PayloadAction<{
				user: { id: string; name: string; email: string };
			}>
		) {
			state.isAuthenticated = true;
			state.user = action.payload.user;
		},
		clearAuth(state) {
			state.isAuthenticated = false;
			state.user = undefined;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setInitialized(state, action: PayloadAction<boolean>) {
			state.initialized = action.payload;
			state.loading = false;
		},
	},
});

export const { setAuth, clearAuth, setLoading, setInitialized } =
	authSlice.actions;
export default authSlice.reducer;
