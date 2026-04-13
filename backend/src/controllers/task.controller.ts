/**
 * Task Controller
 * Handles all task-related operations
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wsService } from '../websocket/websocket.service';
import { AuthenticatedRequest } from '../middleware/auth';

// Helper: Parse tags from string or array
function parseTags(tags: any): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags);
    } catch {
      return tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
  }
  return [];
}

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      project_id,
      section_id,
      assignee_id,
      status,
      priority,
      search,
      page = '1',
      limit = '50',
      sort = 'position',
      order = 'asc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (project_id) where.project_id = project_id;
    if (section_id) where.section_id = section_id;
    if (assignee_id) where.assignee_id = assignee_id;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const orderBy: any = {};
    orderBy[sort as string] = order;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          assignee: {
            select: { id: true, name: true, avatar_url: true },
          },
          creator: {
            select: { id: true, name: true, avatar_url: true },
          },
          _count: {
            select: {
              subtasks: true,
              comments: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        data: tasks,
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

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: { id: true, name: true, avatar_url: true },
        },
        creator: {
          select: { id: true, name: true, avatar_url: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, avatar_url: true },
            },
          },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      description,
      project_id,
      section_id,
      assignee_id,
      priority = 'medium',
      status = 'todo',
      due_date,
      start_date,
      estimated_hours,
      tags = [],
      parent_task_id,
    } = req.body;

    if (!title || !project_id) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title and project_id are required',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Get max position for ordering
    const maxPosition = await prisma.task.aggregate({
      where: { project_id, section_id: section_id || null },
      _max: { position: true },
    });

    // Build data object, excluding undefined values
    const taskData: any = {
      title,
      description,
      project_id,
      creator_id: req.userId!,
      priority,
      status,
      tags: JSON.stringify(tags),
      position: (maxPosition._max.position ?? -1) + 1,
    };

    // Only add optional fields if they are defined
    if (section_id) taskData.section_id = section_id;
    if (assignee_id) taskData.assignee_id = assignee_id;
    if (due_date) taskData.due_date = due_date;
    if (start_date) taskData.start_date = start_date;
    if (estimated_hours) taskData.estimated_hours = estimated_hours;
    if (parent_task_id) taskData.parent_task_id = parent_task_id;

    const task = await prisma.task.create({
      data: taskData,
      include: {
        assignee: {
          select: { id: true, name: true, avatar_url: true },
        },
        creator: {
          select: { id: true, name: true, avatar_url: true },
        },
      },
    });

    // Broadcast real-time update
    wsService.broadcastTaskUpdate('create', task);

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const {
      title,
      description,
      status,
      priority,
      assignee_id,
      due_date,
      start_date,
      estimated_hours,
      tags,
      position,
      section_id,
      parent_task_id,
    } = req.body;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(assignee_id !== undefined && { assignee_id }),
        ...(due_date !== undefined && { due_date }),
        ...(start_date !== undefined && { start_date }),
        ...(estimated_hours !== undefined && { estimated_hours }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(position !== undefined && { position }),
        ...(section_id !== undefined && { section_id }),
        ...(parent_task_id !== undefined && { parent_task_id }),
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatar_url: true },
        },
        creator: {
          select: { id: true, name: true, avatar_url: true },
        },
      },
    });

    // Broadcast real-time update
    wsService.broadcastTaskUpdate('update', task);

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    await prisma.task.delete({ where: { id } });

    // Broadcast real-time update
    wsService.broadcastTaskUpdate('delete', { id });

    res.json({
      success: true,
      data: null,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Status is required',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assignee: {
          select: { id: true, name: true, avatar_url: true },
        },
        creator: {
          select: { id: true, name: true, avatar_url: true },
        },
      },
    });

    wsService.broadcastTaskUpdate('update', task);

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const getTaskComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId as string;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { task_id: taskId, parent_comment_id: null },
        skip,
        take: limitNum,
        orderBy: { created_at: 'asc' },
        include: {
          user: {
            select: { id: true, name: true, avatar_url: true },
          },
          replies: {
            include: {
              user: {
                select: { id: true, name: true, avatar_url: true },
              },
            },
            orderBy: { created_at: 'asc' },
          },
        },
      }),
      prisma.comment.count({ where: { task_id: taskId, parent_comment_id: null } }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        data: comments,
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

export const createComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId as string;
    const { content, parent_comment_id } = req.body;

    if (!content) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Content is required',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        task_id: taskId,
        user_id: req.userId!,
        parent_comment_id,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar_url: true },
        },
      },
    });

    wsService.broadcastCommentCreate(comment);

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { content } = req.body;

    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'COMMENT_NOT_FOUND',
          message: 'Comment not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: {
        content,
        edited_at: new Date(),
      },
      include: {
        user: {
          select: { id: true, name: true, avatar_url: true },
        },
      },
    });

    res.json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'COMMENT_NOT_FOUND',
          message: 'Comment not found',
          timestamp: new Date().toISOString(),
        },
      });
    }

    await prisma.comment.delete({ where: { id } });

    res.json({
      success: true,
      data: null,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
