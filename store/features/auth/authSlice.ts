import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from './types';

const initialState: AuthState = {
  tempEmail: null,
  tempToken: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTempEmail: (state, action: PayloadAction<string>) => {
      state.tempEmail = action.payload;
    },

    setTempToken: (state, action: PayloadAction<string>) => {
      state.tempToken = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    removeUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setTempEmail, setTempToken, setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;
