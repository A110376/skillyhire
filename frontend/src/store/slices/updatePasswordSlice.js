// src/redux/slices/updatePasswordSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const updatePasswordSlice = createSlice({
  name: 'updatePassword',
  initialState: {
    loading: false,
    error: null,
    isPasswordUpdated: false,
  },
  reducers: {
    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updatePasswordSuccess(state) {
      state.loading = false;
      state.isPasswordUpdated = true;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetUpdatePasswordState(state) {
      state.isPasswordUpdated = false;
      state.error = null;
    },
  },
});

export const {
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFailed,
  resetUpdatePasswordState,
} = updatePasswordSlice.actions;

// Async action for updating user password
export const updateUserPassword = (passwordData) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const { data } = await axios.put(
      'http://localhost:4000/api/v1/user/update/password',
      passwordData,
      config
    );

    dispatch(updatePasswordSuccess(data.success));
  } catch (error) {
    dispatch(
      updatePasswordFailed(
        error?.response?.data?.message || error.message || 'Failed to update password.'
      )
    );
  }
};

export default updatePasswordSlice.reducer;
