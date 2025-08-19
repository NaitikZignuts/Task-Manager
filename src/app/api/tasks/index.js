import { getSession } from 'next-auth/react';
import { getTasks } from '../../../../features/tasks/taskService';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const tasks = await getTasks(session.user.uid, session.user.role);
      return res.status(200).json(tasks);
    } else if (req.method === 'POST') {
      const taskData = req.body;
      const newTask = await addTask({
        ...taskData,
        ownerId: session.user.uid,
      });
      return res.status(201).json(newTask);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}