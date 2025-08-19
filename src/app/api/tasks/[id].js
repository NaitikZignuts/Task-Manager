import { getSession } from 'next-auth/react';
import { updateTask, deleteTask } from '../../../../features/tasks/taskService';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if (req.method === 'PUT') {
      const taskData = req.body;
      const updatedTask = await updateTask(id, taskData);
      return res.status(200).json(updatedTask);
    } else if (req.method === 'DELETE') {
      await deleteTask(id);
      return res.status(204).end();
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}