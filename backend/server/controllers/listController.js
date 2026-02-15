const List = require('../models/List');
const Board = require('../models/Board');
const { createActivity } = require('../utils/activity');

const getLists = async (req, res, next) => {
  try {
    const { boardId } = req.query;
    if (!boardId) {
      return res.status(400).json({ message: 'boardId is required' });
    }

    const lists = await List.find({ board: boardId }).sort({ position: 1 });
    res.json(lists);
  } catch (error) {
    next(error);
  }
};

const createList = async (req, res, next) => {
  try {
    const { boardId, title } = req.body;
    if (!boardId || !title) {
      return res.status(400).json({ message: 'boardId and title are required' });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const isMember = board.members.some((member) => member.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const count = await List.countDocuments({ board: boardId });
    const list = await List.create({ board: boardId, title, position: count });

    await createActivity({
      boardId,
      userId: req.user.id,
      action: 'list-created',
      entityType: 'list',
      entityId: list._id,
      message: `List created: ${title}`,
      io: req.io
    });

    req.io.to(boardId.toString()).emit('list-created', list);
    res.status(201).json(list);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLists, createList };
