// src/store/store.js
import authReducer from '../features/auth/authSlice';
import customersReducer from '../features/customers/customersSlice';
import leadsReducer from '../features/leads/leadsSlice'; // CRITICAL: Check this path

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    leads: leadsReducer, // Ensure it's here
  },
});