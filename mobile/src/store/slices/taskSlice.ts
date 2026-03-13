import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/client';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string; title: string; status: TaskStatus; priority: TaskPriority;
  dueDate?: string; assigneeId?: string; tags: string[]; updatedAt: string;
}

interface TaskState {
  items: Task[]; selected: Task | null; loading: boolean;
  total: number; totalPages: number; page: number;
}

const init: TaskState = { items: [], selected: null, loading: false, total: 0, totalPages: 1, page: 1 };

export const fetchTaskFeed = createAsyncThunk('tasks/feed', async (params: Record<string, string> = {}) => {
  const q = new URLSearchParams(params).toString();
  const { data } = await api.get(`/tasks/feed?${q}`);
  return data;
});

export const fetchTaskDetail = createAsyncThunk('tasks/detail', async (id: string) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data.data;
});

export const createTask = createAsyncThunk('tasks/create', async (payload: Partial<Task>) => {
  const { data } = await api.post('/tasks', payload);
  return data.data;
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ id, status }: { id: string; status: TaskStatus }) => {
  const { data } = await api.patch(`/tasks/${id}`, { status });
  return data.data;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string) => {
  await api.delete(`/tasks/${id}`);
  return id;
});

const taskSlice = createSlice({
  name: 'tasks', initialState: init,
  reducers: { clearSelected: (s) => { s.selected = null; } },
  extraReducers: (b) => {
    b.addCase(fetchTaskFeed.pending, (s) => { s.loading = true; });
    b.addCase(fetchTaskFeed.fulfilled, (s, a) => {
      s.loading = false; s.items = a.payload.data ?? [];
      s.total = a.payload.pagination?.total ?? 0;
      s.totalPages = a.payload.pagination?.totalPages ?? 1;
      s.page = a.payload.pagination?.page ?? 1;
    });
    b.addCase(fetchTaskFeed.rejected, (s) => { s.loading = false; });
    b.addCase(fetchTaskDetail.fulfilled, (s, a) => { s.selected = a.payload; });
    b.addCase(createTask.fulfilled, (s, a) => { s.items.unshift(a.payload); s.total += 1; });
    b.addCase(updateTaskStatus.fulfilled, (s, a) => {
      const i = s.items.findIndex((t) => t.id === a.payload.id);
      if (i !== -1) s.items[i] = { ...s.items[i], ...a.payload };
    });
    b.addCase(deleteTask.fulfilled, (s, a) => { s.items = s.items.filter((t) => t.id !== a.payload); });
  },
});
export const { clearSelected } = taskSlice.actions;
export default taskSlice.reducer;
