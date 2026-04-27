// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './slices/jobSlice';       // ✅ یہ لائن شامل کریں
import userReducer from './slices/userSlice';
import applicationReducer from './slices/applicationSlice';
import updateProfileReducer from './slices/updateProfileSlice';
import updatePasswordReducer from "./slices/updatePasswordSlice"; // adjust path if needed



export const store = configureStore({
  reducer: {
    user:userReducer,
    jobs: jobReducer,          // ✅ یہ اب ٹھیک کام کرے گا
    applications:applicationReducer,
    updateProfile:updateProfileReducer,
     updatePassword: updatePasswordReducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ disable this in dev
    }),
});

export default store;
