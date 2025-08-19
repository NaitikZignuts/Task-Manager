import { db } from '../../config/firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export const getTasks = async (userId, role) => {
  try {
    let q;
    if (role === 'admin') {
      q = query(collection(db, 'tasks'));
    } else {
      q = query(
        collection(db, 'tasks'),
        where('ownerId', '==', userId)
      );
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const addTask = async (taskData) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...taskData };
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    await updateDoc(doc(db, 'tasks', taskId), taskData);
    return { id: taskId, ...taskData };
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error) {
    throw error;
  }
};

export const subscribeToTasks = (userId, role, callback) => {
  let q;
  if (role === 'admin') {
    q = query(collection(db, 'tasks'));
  } else {
    q = query(
      collection(db, 'tasks'),
      where('ownerId', '==', userId)
    );
  }
  return onSnapshot(q, (querySnapshot) => {
    const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(tasks);
  });
};