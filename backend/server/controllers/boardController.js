const Board = require('../models/Board');
const List = require('../models/List');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const User = require('../models/User');
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

const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ members: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('members', 'name email');
    res.json(boards);
  } catch (error) {
    next(error);
  }
};

const getBoard = async (req, res, next) => {
  try {
    const board = await ensureMember(req.params.id, req.user.id);
    await board.populate('members', 'name email');

    const lists = await List.find({ board: board._id }).sort({ position: 1 });
    const tasks = await Task.find({ board: board._id }).sort({ position: 1 });

    res.json({ board, lists, tasks });
  } catch (error) {
    next(error);
  }
};

const createBoard = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Board name is required' });
    }

    const board = await Board.create({
      name,
      owner: req.user.id,
      members: [req.user.id]
    });

    await createActivity({
      boardId: board._id,
      userId: req.user.id,
      action: 'board-created',
      entityType: 'board',
      entityId: board._id,
      message: `Board created: ${board.name}`,
      io: req.io
    });

    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can delete the board' });
    }

    await List.deleteMany({ board: board._id });
    await Task.deleteMany({ board: board._id });
    await Activity.deleteMany({ board: board._id });
    await board.deleteOne();

    res.json({ message: 'Board deleted' });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { email, userId } = req.body;
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can add members' });
    }

    const user = await User.findOne({
      $or: [{ email }, { _id: userId }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const exists = board.members.some((member) => member.toString() === user._id.toString());
    if (!exists) {
      board.members.push(user._id);
      await board.save();
    }

    await createActivity({
      boardId: board._id,
      userId: req.user.id,
      action: 'member-added',
      entityType: 'user',
      entityId: user._id,
      message: `Added ${user.name} to board`,
      io: req.io
    });

    await board.populate('members', 'name email');
    res.json(board);
  } catch (error) {
    next(error);
  }
};

module.exports = { getBoards, getBoard, createBoard, deleteBoard, addMember };
