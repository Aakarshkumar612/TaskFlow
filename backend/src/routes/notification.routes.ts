/**
 * Notification Routes
 */

import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

router.get('/', notificationController.getNotifications);
router.get('/unread/count', notificationController.getUnreadCount);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;
