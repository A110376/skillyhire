// ✅ This is your original code, no changes at all
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { updateUser } from './userSlice';

const updateProfileSlice = createSlice({
  name: 'updateProfile',
  initialState: {
    loading: false,
    error: null,
    isProfileUpdated: false,
  },
  reducers: {
    updateProfileRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess(state) {
      state.loading = false;
      state.isProfileUpdated = true;
    },
    updateProfileFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetUpdateProfileState(state) {
      state.isProfileUpdated = false;
      state.error = null;
    },
  },
});

export const {
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailed,
  resetUpdateProfileState,
} = updateProfileSlice.actions;

export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateProfileRequest());

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    };

    const { data } = await axios.put(
      'http://localhost:4000/api/v1/user/update/profile',
      userData,
      config
    );

    dispatch(updateProfileSuccess(data.success));

    if (data.user) {
      dispatch(updateUser(data.user));
    }
  } catch (error) {
    dispatch(
      updateProfileFailed(
        error?.response?.data?.message || error.message || 'Failed to update profile.'
      )
    );
  }
};

export default updateProfileSlice.reducer;
