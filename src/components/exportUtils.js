export const exportTasksToCSV = (tasks, users) => {
    const getUserEmail = (uid) => {
        const user = users.find(u => u.uid === uid);
        return user ? user.email : 'Unknown';
    };

    const headers = ['Title', 'Description', 'Status', 'Due Date', 'Owner', 'Assigned To'];
    const csvData = tasks.map(task => [
        task.title,
        task.description,
        task.status,
        new Date(task.dueDate).toLocaleDateString(),
        getUserEmail(task.ownerId),
        task.assignedTo ? getUserEmail(task.assignedTo) : 'Unassigned'
    ]);

    const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'tasks_export.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};