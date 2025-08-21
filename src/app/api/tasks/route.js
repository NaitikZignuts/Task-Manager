import {
    collection,
    getDocs,
    query,
    where,
    limit
} from 'firebase/firestore';
import { db } from '../../../config/firebase'; 

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

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
                        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                        dueDate: data.dueDate?.toDate?.()?.toISOString() || new Date().toISOString(),
                        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                    });
                }
            });

            return Response.json({ tasks });
        } else {
            const adminQuery = query(tasksRef, limit(50));
            const querySnapshot = await getDocs(adminQuery);
            const tasks = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                tasks.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                    dueDate: data.dueDate?.toDate?.()?.toISOString() || new Date().toISOString(),
                    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                });
            });

            return Response.json({ tasks });
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}