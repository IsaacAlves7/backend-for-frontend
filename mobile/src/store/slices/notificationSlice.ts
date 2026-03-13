import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/client';

export interface Notification { id: string; title: string; message: string; type: string; read: boolean; createdAt: string; }
interface NotificationState { items: Notification[]; unreadCount: number; loading: boolean; }

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const { data } = await api.get('/notifications?limit=20');
  return data;
});
export const markRead = createAsyncThunk('notifications/markRead', async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
  return id;
});

const slice = createSlice({
  name: 'notifications',
  initialState: { items: [], unreadCount: 0, loading: false } as NotificationState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNotifications.fulfilled, (s, a) => {
      s.items = a.payload.data ?? []; s.unreadCount = a.payload.unreadCount ?? 0; s.loading = false;
    });
    b.addCase(markRead.fulfilled, (s, a) => {
      const n = s.items.find((i) => i.id === a.payload);
      if (n && !n.read) { n.read = true; s.unreadCount = Math.max(0, s.unreadCount - 1); }
    });
  },
});
export default slice.reducer;
