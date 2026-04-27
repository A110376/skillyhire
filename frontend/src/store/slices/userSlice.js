import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  isAuthenticated: false,
  user: {},
  error: null,
  message: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    // Register
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.error = null;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },

    // Login
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.error = null;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },

    // Get User
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user || action.payload;
      state.error = null;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },

    // Logout
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = "Logged out successfully.";
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Update User
    updateUser(state, action) {
      state.user = action.payload;
    },

    // Utilities
    clearAllErrors(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
});

export const {
  setLoading,
  registerSuccess,
  registerFailed,
  loginSuccess,
  loginFailed,
  fetchUserSuccess,
  fetchUserFailed,
  logoutSuccess,
  logoutFailed,
  updateUser,
  clearAllErrors,
  clearMessage,
} = userSlice.actions;

// Base URL


// Utility: extract error
const extractError = (err, fallback = "Something went wrong") =>
  err?.response?.data?.message || err?.message || fallback;

// Register
export const register = (data) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.post(`http://localhost:4000/api/v1/user/register`, data, {
      withCredentials: true,
    });

    dispatch(registerSuccess(response.data));
    dispatch(getUser()); // optional: fetch user after register
  } catch (error) {
    console.error("Registration error:", error);
    dispatch(registerFailed(extractError(error, "Registration failed")));
  }
};

// Login
export const login = (data) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.post(`http://localhost:4000/api/v1/user/login`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    dispatch(loginSuccess(response.data));
    dispatch(getUser()); // optional: fetch user after login
  } catch (error) {
    console.error("Login error:", error);
    dispatch(loginFailed(extractError(error, "Login failed")));
  }
};

// Get current user
export const getUser = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.get(`http://localhost:4000/api/v1/user/getuser`, {
      withCredentials: true,
    });

    dispatch(fetchUserSuccess(response.data));
  } catch (error) {
    console.error("Get user error:", error);
    if (error.response?.status === 401) {
      dispatch(logoutSuccess());
    }
    dispatch(fetchUserFailed(extractError(error, "Fetching user failed")));
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`http://localhost:4000/api/v1/user/logout`, { withCredentials: true });
    dispatch(logoutSuccess());
  } catch (error) {
    console.error("Logout error:", error);
    dispatch(logoutFailed(extractError(error, "Logout failed")));
  }
};

// Utilities
export const clearAllUserErrors = () => (dispatch) => {
  dispatch(clearAllErrors());
};

export const clearUserMessage = () => (dispatch) => {
  dispatch(clearMessage());
};

export default userSlice.reducer;
