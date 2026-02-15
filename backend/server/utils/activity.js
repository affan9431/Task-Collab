const Activity = require('../models/Activity');

const createActivity = async ({ boardId, userId, action, entityType, entityId, message, io }) => {
  const activity = await Activity.create({
    board: boardId,
    user: userId,
    action,
    entityType,
    entityId,
    message
  });

  if (io) {
    io.to(boardId.toString()).emit('activity-added', activity);
  }

  return activity;
};

module.exports = { createActivity };
