/**
 * Task Routes
 */

import { Router } from 'express';
import * as taskController from '../controllers/task.controller';

const router = Router();

// Task routes
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/status', taskController.updateTaskStatus);

// Comment routes
router.get('/:taskId/comments', taskController.getTaskComments);
router.post('/:taskId/comments', taskController.createComment);
router.put('/comments/:id', taskController.updateComment);
router.delete('/comments/:id', taskController.deleteComment);

export default router;
