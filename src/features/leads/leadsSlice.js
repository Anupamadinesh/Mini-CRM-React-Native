// src/features/leads/leadsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Example: Assuming your computer's local network IP is 192.168.1.10
const API_URL = 'http://192.168.31.238:3000';

const createConfig = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

// Thunk to fetch leads for a specific customer
export const fetchLeadsByCustomer = createAsyncThunk(
  'leads/fetchLeadsByCustomer',
  async (customerId, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    // JSON Server: Filter leads by customerId
    const response = await axios.get(`${API_URL}/leads?customerId=${customerId}`, createConfig(token));
    return response.data;
  }
);

// Thunk to fetch ALL leads (for the dashboard)
export const fetchAllLeads = createAsyncThunk(
  'leads/fetchAllLeads',
  async (_, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    const response = await axios.get(`${API_URL}/leads`, createConfig(token));
    return response.data;
  }
);

// Thunk to create a new lead
export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    const response = await axios.post(`${API_URL}/leads`, leadData, createConfig(token));
    return response.data;
  }
);

// Thunk to update a lead
export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, ...leadData }, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    const response = await axios.put(`${API_URL}/leads/${id}`, leadData, createConfig(token));
    return response.data;
  }
);

// Thunk to delete a lead
export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (leadId, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    await axios.delete(`${API_URL}/leads/${leadId}`, createConfig(token));
    return leadId;
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    allLeads: [],
    leadsByCustomer: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch by Customer
      .addCase(fetchLeadsByCustomer.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchLeadsByCustomer.fulfilled, (state, action) => { state.status = 'succeeded'; state.leadsByCustomer = action.payload; })
      
      // Fetch All (Dashboard)
      .addCase(fetchAllLeads.fulfilled, (state, action) => { state.allLeads = action.payload; })

      // Create
      .addCase(createLead.fulfilled, (state, action) => {
        state.leadsByCustomer.push(action.payload);
      })
      
      // Update
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leadsByCustomer.findIndex(lead => lead.id === action.payload.id);
        if (index !== -1) { state.leadsByCustomer[index] = action.payload; }
      })
      
      // Delete
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leadsByCustomer = state.leadsByCustomer.filter(lead => lead.id !== action.payload);
      });
  },
});

export default leadsSlice.reducer;