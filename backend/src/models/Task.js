const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    column: { type: mongoose.Schema.Types.ObjectId, ref: 'Column' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    status: { type: String, default: 'todo' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    order: { type: Number, default: 0 },
    isPersonal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
