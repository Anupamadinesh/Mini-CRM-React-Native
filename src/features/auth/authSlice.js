// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// CRITICAL: Use the Android emulator's alias for the host machine
// Example: Assuming your computer's local network IP is 192.168.1.10
const API_URL = 'http://localhost:3000';

// Thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      // NOTE: JSON Server expects a POST to a resource endpoint (e.g., /login)
      const response = await axios.post(`${API_URL}/login`, credentials); 
      const { token, user } = response.data.login; // Adjusted for nested JSON Server structure
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    logout: (state) => {
      AsyncStorage.clear();
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.token = null;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;