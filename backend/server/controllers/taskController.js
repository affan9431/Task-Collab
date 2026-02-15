const Board = require('../models/Board');
const List = require('../models/List');
const Task = require('../models/Task');
const { createActivity } = require('../utils/activity');

const ensureMember = async (boardId, userId) => {
  const board = await Board.findById(boardId);
  if (!board) {
    const error = new Error('Board not found');
    error.status = 404;
    throw error;
  }

  const isMember = board.members.some((member) => member.toString() === userId);
  if (!isMember) {
    const error = new Error('Access denied');
    error.status = 403;
    throw error;
  }

  return board;
};

const getTasks = async (req, res, next) => {
  try {
    const { boardId, listId, search, page = 1, limit = 20 } = req.query;
    if (!boardId) {
      return res.status(400).json({ message: 'boardId is required' });
    }

    await ensureMember(boardId, req.user.id);

    const query = { board: boardId };
    if (listId) {
      query.list = listId;
    }
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Task.find(query).sort({ position: 1 }).skip(skip).limit(Number(limit)),
      Task.countDocuments(query)
    ]);

    res.json({
      items,
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { boardId, listId, title, description, assignedTo, priority, status } = req.body;
    if (!boardId || !listId || !title) {
      return res.status(400).json({ message: 'boardId, listId, and title are required' });
    }

    await ensureMember(boardId, req.user.id);

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    const count = await Task.countDocuments({ list: listId });
    const task = await Task.create({
      board: boardId,
      list: listId,
      title,
      description,
      assignedTo,
      priority,
      status,
      position: count
    });

    await createActivity({
      boardId,
      userId: req.user.id,
      action: 'task-created',
      entityType: 'task',
      entityId: task._id,
      message: `Task created: ${title}`,
      io: req.io
    });

    req.io.to(boardId.toString()).emit('task-created', task);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await ensureMember(task.board, req.user.id);

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    await task.save();

    await createActivity({
      boardId: task.board,
      userId: req.user.id,
      action: 'task-updated',
      entityType: 'task',
      entityId: task._id,
      message: `Task updated: ${task.title}`,
      io: req.io
    });

    req.io.to(task.board.toString()).emit('task-updated', task);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await ensureMember(task.board, req.user.id);
    await task.deleteOne();

    await createActivity({
      boardId: task.board,
      userId: req.user.id,
      action: 'task-deleted',
      entityType: 'task',
      entityId: task._id,
      message: `Task deleted: ${task.title}`,
      io: req.io
    });

    req.io.to(task.board.toString()).emit('task-deleted', {
      _id: task._id,
      list: task.list
    });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

const moveTask = async (req, res, next) => {
  try {
    const { listId, position } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await ensureMember(task.board, req.user.id);

    if (listId) {
      task.list = listId;
    }
    if (position !== undefined) {
      task.position = position;
    }

    await task.save();

    await createActivity({
      boardId: task.board,
      userId: req.user.id,
      action: 'task-moved',
      entityType: 'task',
      entityId: task._id,
      message: `Task moved: ${task.title}`,
      io: req.io
    });

    req.io.to(task.board.toString()).emit('task-moved', task);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, moveTask };
