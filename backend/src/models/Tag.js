const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    color: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tag', tagSchema);
