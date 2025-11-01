const mongoose = require('mongoose');

const archiveItemSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    type: { type: String, enum: ['project', 'task', 'column'], required: true },
    objectRef: { type: mongoose.Schema.Types.ObjectId, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    archivedAt: { type: Date, default: Date.now },
    restored: { type: Boolean, default: false },
  },
  { timestamps: true }
);

archiveItemSchema.index({ type: 1, project: 1 });

archiveItemSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

archiveItemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ArchiveItem', archiveItemSchema);
