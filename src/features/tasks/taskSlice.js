import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId = null, { rejectWithValue }) => {
    try {
      const tasksRef = collection(db, 'tasks');
      
      if (userId) {
        const ownedTasksQuery = query(
          tasksRef, 
          where('ownerId', '==', userId),
          limit(50)
        );
        const assignedTasksQuery = query(
          tasksRef, 
          where('assignedTo', '==', userId),
          limit(50)
        );
        
        const [ownedSnapshot, assignedSnapshot] = await Promise.all([
          getDocs(ownedTasksQuery),
          getDocs(assignedTasksQuery)
        ]);
        
        const tasks = [];
        const taskIds = new Set();
        
        ownedSnapshot.forEach((doc) => {
          const data = doc.data();
          tasks.push({
            id: doc.id,
            ...data,
            // Ensure dates are converted to strings
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            dueDate: data.dueDate?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          });
          taskIds.add(doc.id);
        });
        
        assignedSnapshot.forEach((doc) => {
          if (!taskIds.has(doc.id)) {
            const data = doc.data();
            tasks.push({
              id: doc.id,
              ...data,
              // Ensure dates are converted to strings
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              dueDate: data.dueDate?.toDate?.()?.toISOString() || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            });
          }
        });
        
        return tasks;
      } else {
        const adminQuery = query(tasksRef, limit(50));
        const querySnapshot = await getDocs(adminQuery);
        const tasks = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tasks.push({
            id: doc.id,
            ...data,
            // Ensure dates are converted to strings
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            dueDate: data.dueDate?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          });
        });

        return tasks;
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const tasksRef = collection(db, 'tasks');
      
      // Convert dueDate to Firestore Timestamp if it's a string
      const dueDate = taskData.dueDate ? 
        (typeof taskData.dueDate === 'string' ? new Date(taskData.dueDate) : taskData.dueDate) : 
        new Date();
      
      const docRef = await addDoc(tasksRef, {
        ...taskData,
        dueDate: dueDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Return serializable data (convert dates to strings)
      return {
        id: docRef.id,
        ...taskData,
        dueDate: dueDate.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating task:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const editTask = createAsyncThunk(
  'tasks/editTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      
      // Convert dueDate to Firestore Timestamp if it's a string
      const dueDate = taskData.dueDate ? 
        (typeof taskData.dueDate === 'string' ? new Date(taskData.dueDate) : taskData.dueDate) : 
        new Date();
      
      await updateDoc(taskRef, {
        ...taskData,
        dueDate: dueDate,
        updatedAt: new Date(),
      });
      
      // Return serializable data
      return {
        id,
        ...taskData,
        dueDate: dueDate.toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error updating task:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      return taskId;
    } catch (error) {
      console.error('Error deleting task:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tasks: [],
  status: 'idle',
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetTasks: (state) => {
      state.tasks = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(editTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...action.payload };
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, resetTasks } = taskSlice.actions;
export default taskSlice.reducer;