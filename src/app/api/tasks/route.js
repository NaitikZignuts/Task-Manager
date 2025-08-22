import {
    collection,
    getDocs,
    query,
    where,
    limit,
    orderBy
} from 'firebase/firestore';
import { db } from '../../../config/firebase';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const searchTerm = searchParams.get('searchTerm') || '';
        const statusFilter = searchParams.get('statusFilter') || 'all';
        const dateFilter = searchParams.get('dateFilter') || 'all';
        const page = parseInt(searchParams.get('page')) || 1;
        const pageSize = parseInt(searchParams.get('pageSize')) || 10;

        const tasksRef = collection(db, 'tasks');

        const filterTasksBySearch = (tasks) => {
            if (!searchTerm) return tasks;
            const term = searchTerm.toLowerCase();
            return tasks.filter(task =>
                task.title.toLowerCase().includes(term) ||
                task.description.toLowerCase().includes(term)
            );
        };

        const filterTasksByStatus = (tasks) => {
            if (!statusFilter || statusFilter === 'all' || statusFilter === 'null' || statusFilter === '') {
                return tasks;
            }
            return tasks.filter(task => task.status === statusFilter);
        };

        const filterTasksByDate = (tasks) => {
            if (!dateFilter || dateFilter === 'all' || dateFilter === 'null' || dateFilter === '') {
                return tasks;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return tasks.filter(task => {
                const taskDueDate = new Date(task.dueDate);

                switch (dateFilter) {
                    case 'today':
                        const todayEnd = new Date(today);
                        todayEnd.setDate(today.getDate() + 1);
                        return taskDueDate >= today && taskDueDate < todayEnd;
                    case 'week':
                        const weekEnd = new Date(today);
                        weekEnd.setDate(today.getDate() + 7);
                        return taskDueDate >= today && taskDueDate <= weekEnd;
                    case 'month':
                        const monthEnd = new Date(today);
                        monthEnd.setMonth(today.getMonth() + 1);
                        return taskDueDate >= today && taskDueDate <= monthEnd;
                    case 'overdue':
                        return taskDueDate < today;
                    default:
                        return true;
                }
            });
        };

        const sortTasksByCreatedAt = (tasks) => {
            return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        };

        const paginateTasks = (tasks) => {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            return {
                tasks: tasks.slice(startIndex, endIndex),
                totalCount: tasks.length,
                totalPages: Math.ceil(tasks.length / pageSize),
                currentPage: page,
                pageSize
            };
        };

        const convertFirestoreTask = (doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                dueDate: data.dueDate?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            };
        };

        let allTasks = [];

        if (userId) {
            const ownedTasksQuery = query(
                tasksRef,
                where('ownerId', '==', userId),
                limit(1000)
            );

            const assignedTasksQuery = query(
                tasksRef,
                where('assignedTo', '==', userId),
                limit(1000)
            );

            const [ownedSnapshot, assignedSnapshot] = await Promise.all([
                getDocs(ownedTasksQuery),
                getDocs(assignedTasksQuery)
            ]);

            const taskIds = new Set();

            ownedSnapshot.forEach((doc) => {
                const task = convertFirestoreTask(doc);
                allTasks.push(task);
                taskIds.add(doc.id);
            });

            assignedSnapshot.forEach((doc) => {
                if (!taskIds.has(doc.id)) {
                    const task = convertFirestoreTask(doc);
                    allTasks.push(task);
                }
            });
        } else {
            const hasFilters = (statusFilter && statusFilter !== 'all' && statusFilter !== 'null' && statusFilter !== '') ||
                (dateFilter && dateFilter !== 'all' && dateFilter !== 'null' && dateFilter !== '') ||
                (searchTerm && searchTerm.trim() !== '');

            if (hasFilters) {
                const adminQuery = query(tasksRef, limit(1000));
                const querySnapshot = await getDocs(adminQuery);

                querySnapshot.forEach((doc) => {
                    const task = convertFirestoreTask(doc);
                    allTasks.push(task);
                });
            } else {
                const adminQuery = query(
                    tasksRef,
                    orderBy('createdAt', 'desc'),
                    limit(1000)
                );
                const querySnapshot = await getDocs(adminQuery);

                querySnapshot.forEach((doc) => {
                    const task = convertFirestoreTask(doc);
                    allTasks.push(task);
                });
            }
        }

        let filteredTasks = allTasks;
        filteredTasks = filterTasksByStatus(filteredTasks);
        filteredTasks = filterTasksByDate(filteredTasks);
        filteredTasks = filterTasksBySearch(filteredTasks);

        const sortedTasks = sortTasksByCreatedAt(filteredTasks);

        const paginatedResult = paginateTasks(sortedTasks);

        return Response.json(paginatedResult);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}