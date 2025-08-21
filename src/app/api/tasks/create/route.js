import {
    collection,
    addDoc
} from 'firebase/firestore';
import { db } from '../../../../config/firebase'; 

export async function POST(request) {
    try {
        const taskData = await request.json();
        const tasksRef = collection(db, 'tasks');

        const dueDate = taskData.dueDate
            ? (typeof taskData.dueDate === 'string' ? new Date(taskData.dueDate) : taskData.dueDate)
            : new Date();

        const docRef = await addDoc(tasksRef, {
            ...taskData,
            dueDate,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const newTask = {
            id: docRef.id,
            ...taskData,
            dueDate: dueDate.toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        return new Response(JSON.stringify({ task: newTask }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Error creating task:', error);
        return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
