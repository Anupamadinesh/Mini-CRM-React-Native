// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'; // <--- CRITICAL FIX: Add this line
import authReducer from '../features/auth/authSlice';
import customersReducer from '../features/customers/customersSlice';
import leadsReducer from '../features/leads/leadsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    leads: leadsReducer,
  },
});