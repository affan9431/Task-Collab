const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Board = require('../models/Board');
const List = require('../models/List');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

const seed = async () => {
  dotenv.config();
  await mongoose.connect(process.env.MONGO_URI, { autoIndex: true });

  await Promise.all([
    User.deleteMany({}),
    Board.deleteMany({}),
    List.deleteMany({}),
    Task.deleteMany({}),
    Activity.deleteMany({})
  ]);

  const password = await bcrypt.hash('demo1234', 10);
  const user = await User.create({ name: 'Demo User', email: 'demo@taskcollab.dev', password });

  const board = await Board.create({ name: 'Demo Board', owner: user._id, members: [user._id] });
  const todo = await List.create({ board: board._id, title: 'Todo', position: 0 });
  const doing = await List.create({ board: board._id, title: 'In Progress', position: 1 });
  const done = await List.create({ board: board._id, title: 'Done', position: 2 });

  await Task.create({
    board: board._id,
    list: todo._id,
    title: 'Design onboarding flow',
    description: 'Draft the first-time user experience',
    priority: 'high',
    status: 'todo',
    position: 0
  });

  await Task.create({
    board: board._id,
    list: doing._id,
    title: 'Build realtime socket layer',
    description: 'Join board rooms and emit updates',
    priority: 'medium',
    status: 'in-progress',
    position: 0
  });

  await Task.create({
    board: board._id,
    list: done._id,
    title: 'Create demo data',
    description: 'Seed sample tasks for the team',
    priority: 'low',
    status: 'done',
    position: 0
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete');
  await mongoose.disconnect();
};

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
