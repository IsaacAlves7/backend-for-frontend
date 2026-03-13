import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/api/client';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  userId: string;
  assigneeId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  items: Task[];
  selected: Task | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  stats: { total: number; todo: number; inProgress: number; review: number; done: number } | null;
}

const initialState: TaskState = {
  items: [], selected: null, loading: false, error: null,
  total: 0, page: 1, totalPages: 1, stats: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (params: Record<string, string | number> = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const { data } = await api.get(`/tasks?${query}`);
      return data;
    } catch { return rejectWithValue('Failed to load tasks'); }
  }
);

export const fetchTaskById = createAsyncThunk('tasks/fetchOne', async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/tasks/${id}/detail`);
    return data.data;
  } catch { return rejectWithValue('Task not found'); }
});

export const createTask = createAsyncThunk('tasks/create', async (payload: Partial<Task>, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/tasks', payload);
    return data.data;
  } catch { return rejectWithValue('Failed to create task'); }
});

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, ...payload }: Partial<Task> & { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/tasks/${id}`, payload);
      return data.data;
    } catch { return rejectWithValue('Failed to update task'); }
  }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch { return rejectWithValue('Failed to delete task'); }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<Task | null>) => { state.selected = action.payload; },
    setStats: (state, action: PayloadAction<TaskState['stats']>) => { state.stats = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.pagination?.total ?? 0;
        state.page = action.payload.pagination?.page ?? 1;
        state.totalPages = action.payload.pagination?.totalPages ?? 1;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => { state.selected = action.payload; })
      .addCase(createTask.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setSelected, setStats } = taskSlice.actions;
export default taskSlice.reducer;
