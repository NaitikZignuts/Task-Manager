import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks, addTask, updateTask, deleteTask } from './taskService';
import { serializableCheck } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId, { getState }) => {
    const { auth } = getState();
    const tasks = await getTasks(auth.user.uid, auth.user.role);
    return tasks.map(task => ({
      ...task,
      dueDate: task.dueDate?.toDate ? task.dueDate.toDate().toISOString() : task.dueDate,
      createdAt: task.createdAt?.toDate ? task.createdAt.toDate().toISOString() : task.createdAt,
      updatedAt: task.updatedAt?.toDate ? task.updatedAt.toDate().toISOString() : task.updatedAt
    }));
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData) => {
    const serializedTaskData = {
      ...taskData,
      dueDate: taskData.dueDate instanceof Date ? taskData.dueDate.toISOString() : taskData.dueDate,
      createdAt: taskData.createdAt instanceof Date ? taskData.createdAt.toISOString() : taskData.createdAt
    };
    return await addTask(serializedTaskData);
  }
);

export const editTask = createAsyncThunk(
  'tasks/editTask',
  async ({ id, taskData }) => {
    const serializedTaskData = {
      ...taskData,
      dueDate: taskData.dueDate instanceof Date ? taskData.dueDate.toISOString() : taskData.dueDate,
      updatedAt: taskData.updatedAt instanceof Date ? taskData.updatedAt.toISOString() : taskData.updatedAt
    };
    return await updateTask(id, serializedTaskData);
  }
);

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (taskId) => {
    await deleteTask(taskId);
    return taskId;
  }
);

export const fetchAssignedTasks = createAsyncThunk(
  'tasks/fetchAssignedTasks',
  async (userId) => {
    const q = query(
      collection(db, 'tasks'),
      where('assignedTo', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate ? data.dueDate.toDate().toISOString() : data.dueDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
      };
    });
  }
);

export const fetchCreatedTasks = createAsyncThunk(
  'tasks/fetchCreatedTasks',
  async (userId) => {
    const q = query(
      collection(db, 'tasks'),
      where('ownerId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate ? data.dueDate.toDate().toISOString() : data.dueDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
      };
    });
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;