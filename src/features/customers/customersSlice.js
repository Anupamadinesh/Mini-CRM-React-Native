// src/features/customers/customersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Example: Assuming your computer's local network IP is 192.168.1.10
const API_URL = 'http://localhost:3000';

const createConfig = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

// Thunk for fetching customers
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    const response = await axios.get(`${API_URL}/customers`, createConfig(token));
    return response.data;
  }
);

// Thunk for creating a new customer
export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    const response = await axios.post(`${API_URL}/customers`, customerData, createConfig(token));
    return response.data;
  }
);

// Thunk for updating an existing customer
export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, ...customerData }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    const response = await axios.put(`${API_URL}/customers/${id}`, customerData, createConfig(token));
    return response.data;
  }
);

// Thunk for deleting a customer
export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (customerId, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    await axios.delete(`${API_URL}/customers/${customerId}`, createConfig(token));
    return customerId;
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCustomers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCustomers.fulfilled, (state, action) => { state.status = 'succeeded'; state.customers = action.payload; })
      .addCase(fetchCustomers.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // Create
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      
      // Update
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(cust => cust.id === action.payload.id);
        if (index !== -1) { state.customers[index] = action.payload; }
      })
      
      // Delete
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(cust => cust.id !== action.payload);
      });
  },
});

export default customersSlice.reducer;