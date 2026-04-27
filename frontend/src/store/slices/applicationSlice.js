// 🔧 Redux: applicationSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial State
const initialState = {
  applications: [],
  myApplications: [],
  employerApplications: [],
  singleApplication: null,
  loading: false,
  error: null,
  message: null,
};

// Slice
const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    allApplicationsSuccess(state, action) {
      state.loading = false;
      state.employerApplications = action.payload;
    },
    allApplicationsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    myApplicationsSuccess(state, action) {
      state.loading = false;
      state.myApplications = action.payload;
    },
    myApplicationsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    postApplicationSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    postApplicationFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForDeleteApplication(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForDeleteApplication(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    failureForDeleteApplication(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    applicationByIdSuccess(state, action) {
      state.loading = false;
      state.singleApplication = action.payload;
    },
    clearAllErrors(state) {
      state.error = null;
    },
    resetApplicationSlice() {
      return initialState;
    },
  },
});

// Actions
export const {
  setLoading,
  allApplicationsSuccess,
  allApplicationsFailure,
  myApplicationsSuccess,
  myApplicationsFailure,
  postApplicationSuccess,
  postApplicationFailure,
  requestForDeleteApplication,
  successForDeleteApplication,
  failureForDeleteApplication,
  applicationByIdSuccess,
  clearAllErrors,
  resetApplicationSlice,
} = applicationSlice.actions;

// API Base URL
const API_BASE = 'http://localhost:4000/api/v1';

// Token helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Thunks

// Employer: Get All Applications
export const fetchAllApplications = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data } = await axios.get(`${API_BASE}/application/employer`, {
      headers: getAuthHeaders(),
    });
    dispatch(allApplicationsSuccess(data.applications || []));
  } catch (error) {
    dispatch(allApplicationsFailure(error?.response?.data?.message || 'Failed to fetch applications'));
  }
};

// Job Seeker: Get My Applications
export const fetchMyApplications = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data } = await axios.get(`${API_BASE}/application/jobseeker`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    dispatch(myApplicationsSuccess(data.applications || []));
  } catch (error) {
    dispatch(myApplicationsFailure(error?.response?.data?.message || 'Failed to fetch your applications'));
  }
};

// Job Seeker: Post Application
export const postApplication = (jobId, applicationData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data } = await axios.post(
      `${API_BASE}/application/${jobId}`,
      applicationData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    dispatch(postApplicationSuccess(data.message || 'Application submitted successfully.'));
    dispatch(fetchMyApplications());
  } catch (error) {
    dispatch(postApplicationFailure(error?.response?.data?.message || 'Failed to submit application'));
  }
};

// Delete Application (Job Seeker or Employer)
export const deleteApplication = (id) => async (dispatch) => {
  dispatch(requestForDeleteApplication());

  try {
    const { data } = await axios.delete(`${API_BASE}/application/${id}`, {
      headers: getAuthHeaders(),
    });
    dispatch(successForDeleteApplication(data.message || 'Application deleted successfully.'));
    dispatch(fetchMyApplications());
  } catch (error) {
    dispatch(failureForDeleteApplication(error?.response?.data?.message || 'Failed to delete application'));
  }
};

// Utilities
export const clearApplicationErrors = () => (dispatch) => {
  dispatch(clearAllErrors());
};

export const resetApplication = () => (dispatch) => {
  dispatch(resetApplicationSlice());
};

// Reducer Export
export default applicationSlice.reducer;
