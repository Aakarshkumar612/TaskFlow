/**
 * Notification Controller
 * Handles all notification-related operations
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { getIdParam } from '../utils/helpers';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      is_read,
      type,
      page = '1',
      limit = '50',
      sort = 'created_at',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (is_read !== undefined) {
      where.is_read = is_read === 'true';
    }
    if (type) {
      where.type = type;
    }

    const orderBy: any = {};
    orderBy[sort as string] = order;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
      }),
      prisma.notification.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        data: notifications,
        meta: {
          current_page: pageNum,
          per_page: limitNum,
          total,
          total_pages: totalPages,
          has_next: pageNum < totalPages,
          has_prev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getIdParam(req);

    const notification = await prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });

    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.updateMany({
      where: { is_read: false },
      data: { is_read: true },
    });

    res.json({
      success: true,
      data: null,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getIdParam(req) as string;

    await prisma.notification.delete({ where: { id } });

    res.json({
      success: true,
      data: null,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await prisma.notification.count({
      where: { is_read: false },
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};
