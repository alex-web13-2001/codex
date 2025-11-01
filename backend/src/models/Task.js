const mongoose = require('mongoose');
const { TASK_PRIORITIES } = require('../config/constants');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    column: { type: mongoose.Schema.Types.ObjectId, ref: 'Column' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String, trim: true }],
    priority: { type: String, enum: TASK_PRIORITIES, default: 'medium' },
    status: { type: String, default: 'Assigned' },
    deadline: { type: Date },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    order: { type: Number, default: 0 },
    archived: { type: Boolean, default: false },
    archivedAt: { type: Date },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    personal: { type: Boolean, default: false },
    personalOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

taskSchema.index({ project: 1, column: 1, order: 1 });
taskSchema.index({ personal: 1, personalOwner: 1 });

taskSchema.virtual('isOverdue').get(function () {
  return Boolean(this.deadline && !this.archived && this.deadline < new Date());
});

taskSchema.virtual('dueDate')
  .get(function () {
    return this.deadline;
  })
  .set(function (value) {
    this.deadline = value;
  });

taskSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
