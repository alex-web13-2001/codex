const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    storageKey: { type: String, required: true },
    mimeType: { type: String },
    size: { type: Number },
    url: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);
