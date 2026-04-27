import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  message: null,
  singleJob: {},
  myJobs: [],
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // All Jobs
    requestForAllJobs: (state) => {
      state.loading = true;
      state.error = null;
    },
    successForAllJobs: (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
    },
    failureForAllJobs: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Post Job
    requestForPostJob: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForPostJob: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    failureForPostJob: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // My Jobs
    requestForMyJobs: (state) => {
      state.loading = true;
      state.error = null;
    },
    successForMyJobs: (state, action) => {
      state.loading = false;
      state.myJobs = action.payload;
    },
    failureForMyJobs: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Single Job
    requestForSingleJob: (state) => {
      state.loading = true;
      state.error = null;
    },
    successForSingleJob: (state, action) => {
      state.loading = false;
      state.singleJob = action.payload;
    },
    failureForSingleJob: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete Job
    requestForDeleteJob: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForDeleteJob: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    failureForDeleteJob: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Utilities
    clearAllErrors: (state) => {
      state.error = null;
    },
    resetJobSlice: (state) => {
      return initialState;
    },
  },
});

export const {
  requestForAllJobs,
  successForAllJobs,
  failureForAllJobs,
  requestForPostJob,
  successForPostJob,
  failureForPostJob,
  requestForMyJobs,
  successForMyJobs,
  failureForMyJobs,
  requestForSingleJob,
  successForSingleJob,
  failureForSingleJob,
  requestForDeleteJob,
  successForDeleteJob,
  failureForDeleteJob,
  clearAllErrors,
  resetJobSlice,
} = jobSlice.actions;

// ========== THUNKS ==========

// Fetch All Jobs
export const fetchJobs = ({ city = '', niche = '', searchKeyword = '' } = {}) => async (dispatch) => {
  try {
    dispatch(requestForAllJobs());

    const queryParams = [];
    if (city) queryParams.push(`city=${encodeURIComponent(city)}`);
    if (niche) queryParams.push(`niche=${encodeURIComponent(niche)}`);
    if (searchKeyword) queryParams.push(`search=${encodeURIComponent(searchKeyword)}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    const link = `http://localhost:4000/api/v1/job/getall${queryString}`;

    const token = localStorage.getItem('token');

    const { data } = await axios.get(link, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const jobsArray = Array.isArray(data.jobs) ? data.jobs : [];
    const formattedJobs = jobsArray.map((job) => ({
      ...job,
      city: job.location,
      niche: job.jobNiche,
      jobPostedOn: job.jobPostedOn || job.createdAt,
    }));

    dispatch(successForAllJobs(formattedJobs));
  } catch (error) {
    dispatch(failureForAllJobs(error.response?.data?.message || error.message));
  }
};

// Fetch Single Job
export const fetchSingleJob = (jobId) => async (dispatch) => {
  try {
    dispatch(requestForSingleJob());

    const { data } = await axios.get(`http://localhost:4000/api/v1/job/get/${jobId}`, {
      withCredentials: true,
    });

    dispatch(successForSingleJob(data.job));
  } catch (error) {
    dispatch(failureForSingleJob(error.response?.data?.message || error.message));
  }
};

// Post Job
export const postJob = (jobData) => async (dispatch) => {
  try {
    dispatch(requestForPostJob());

    const { data } = await axios.post(`http://localhost:4000/api/v1/job/post`, jobData, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });

    dispatch(successForPostJob(data.message));
  } catch (error) {
    dispatch(failureForPostJob(error.response?.data?.message || error.message));
  }
};

// Get My Jobs
export const getMyJobs = () => async (dispatch) => {
  try {
    dispatch(requestForMyJobs());

    const { data } = await axios.get(`http://localhost:4000/api/v1/job/getmyjobs`, {
      withCredentials: true,
    });

    dispatch(successForMyJobs(data.myJobs));
  } catch (error) {
    dispatch(failureForMyJobs(error.response?.data?.message || error.message));
  }
};

// Delete Job
export const deleteJob = (id) => async (dispatch) => {
  try {
    dispatch(requestForDeleteJob());

    const { data } = await axios.delete(`http://localhost:4000/api/v1/job/delete/${id}`, {
      withCredentials: true,
    });

    dispatch(successForDeleteJob(data.message || 'Job deleted successfully.'));
    dispatch(clearAllJobErrors());
  } catch (error) {
    dispatch(failureForDeleteJob(error.response?.data?.message || 'Failed to delete Job'));
  }
};

// Utility Thunks
export const clearAllJobErrors = () => (dispatch) => {
  dispatch(clearAllErrors());
};

export const resetJob = () => (dispatch) => {
  dispatch(resetJobSlice());
};

export default jobSlice.reducer;
