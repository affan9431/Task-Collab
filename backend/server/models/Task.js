const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo'
    },
    position: { type: Number, default: 0 }
  },
  { timestamps: true }
);

taskSchema.index({ title: 'text' });

taskSchema.index({ board: 1, list: 1, position: 1 });

module.exports = mongoose.model('Task', taskSchema);
