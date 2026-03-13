import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';

interface AuthState {
  user: { id: string; name: string; firstName: string; email: string; avatar?: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null, accessToken: null, refreshToken: null,
  loading: false, error: null, initialized: false,
};

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const [accessToken, refreshToken] = await Promise.all([
    AsyncStorage.getItem('accessToken'),
    AsyncStorage.getItem('refreshToken'),
  ]);
  return { accessToken, refreshToken };
});

export const loginThunk = createAsyncThunk('auth/login', async (creds: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', creds);
    await AsyncStorage.multiSet([['accessToken', data.data.accessToken], ['refreshToken', data.data.refreshToken]]);
    return data.data;
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message ?? 'Falha no login');
  }
});

export const registerThunk = createAsyncThunk('auth/register', async (payload: { name: string; email: string; password: string }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    await AsyncStorage.multiSet([['accessToken', data.data.accessToken], ['refreshToken', data.data.refreshToken]]);
    return data.data;
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message ?? 'Falha no cadastro');
  }
});

export const loadDashboard = createAsyncThunk('auth/dashboard', async () => {
  const { data } = await api.get('/dashboard');
  return data.data;
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  try { await api.post('/auth/logout', { refreshToken }); } catch {}
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (b) => {
    b.addCase(initializeAuth.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.initialized = true;
    });
    b.addCase(loginThunk.pending, (state) => { state.loading = true; state.error = null; });
    b.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
    b.addCase(loginThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    b.addCase(registerThunk.pending, (state) => { state.loading = true; state.error = null; });
    b.addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
    b.addCase(registerThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    b.addCase(loadDashboard.fulfilled, (state, action) => { state.user = action.payload.user; });
    b.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null; state.accessToken = null; state.refreshToken = null;
    });
  },
});

export const { setTokens } = authSlice.actions;
export default authSlice.reducer;
