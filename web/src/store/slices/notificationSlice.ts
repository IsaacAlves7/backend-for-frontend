import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/client';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
}

const initialState: NotificationState = { items: [], unreadCount: 0, loading: false };

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async () => {
  const { data } = await api.get('/notifications?limit=30');
  return data;
});

export const markRead = createAsyncThunk('notifications/markRead', async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
  return id;
});

export const markAllRead = createAsyncThunk('notifications/markAllRead', async () => {
  await api.patch('/notifications/read-all');
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, action) => { state.unreadCount = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data ?? [];
        state.unreadCount = action.payload.unreadCount ?? 0;
      })
      .addCase(markRead.fulfilled, (state, action) => {
        const n = state.items.find((i) => i.id === action.payload);
        if (n && !n.read) { n.read = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items.forEach((n) => { n.read = true; });
        state.unreadCount = 0;
      });
  },
});

export const { setUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
