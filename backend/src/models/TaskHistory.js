const mongoose = require('mongoose');

const taskHistorySchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['statusChange', 'assigneeChange', 'edit', 'fileAdd', 'fileRemove', 'priorityChange', 'created', 'deleted'],
      required: true,
    },
    oldValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
    context: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

taskHistorySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

taskHistorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TaskHistory', taskHistorySchema);
