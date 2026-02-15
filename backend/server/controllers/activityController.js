const Activity = require('../models/Activity');
const Board = require('../models/Board');

const getActivities = async (req, res, next) => {
  try {
    const { boardId, page = 1, limit = 20 } = req.query;
    if (!boardId) {
      return res.status(400).json({ message: 'boardId is required' });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const isMember = board.members.some((member) => member.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Activity.find({ board: boardId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'name email'),
      Activity.countDocuments({ board: boardId })
    ]);

    res.json({ items, page: Number(page), limit: Number(limit), total });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivities };
