const mongoose = require('mongoose');

const archiveItemSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    type: { type: String, enum: ['task', 'column'], required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    archivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ArchiveItem', archiveItemSchema);
