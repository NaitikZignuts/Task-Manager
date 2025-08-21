import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../../../../config/firebase'; 
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const taskData = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const taskRef = doc(db, 'tasks', id);

    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const dueDate = taskData.dueDate ?
      (typeof taskData.dueDate === 'string' ? new Date(taskData.dueDate) : taskData.dueDate) :
      new Date();

    const updateData = {
      ...taskData,
      dueDate: dueDate,
      updatedAt: new Date(),
    };

    await updateDoc(taskRef, updateData);

    const updatedTask = {
      id,
      ...taskData,
      dueDate: dueDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const taskData = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const taskRef = doc(db, 'tasks', id);

    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updateData = {
      ...taskData,
      updatedAt: new Date()
    };

    if (taskData.dueDate) {
      updateData.dueDate = typeof taskData.dueDate === 'string' ?
        new Date(taskData.dueDate) : taskData.dueDate;
    }

    await updateDoc(taskRef, updateData);

    const updatedTask = {
      id,
      ...taskData,
      dueDate: updateData.dueDate?.toISOString() || taskData.dueDate,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const taskRef = doc(db, 'tasks', id);

    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await deleteDoc(taskRef);

    return NextResponse.json({
      message: 'Task deleted successfully',
      taskId: id
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete task' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const taskRef = doc(db, 'tasks', id);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const data = taskDoc.data();
    const task = {
      id: taskDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      dueDate: data.dueDate?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch task' },
      { status: 500 }
    );
  }
}