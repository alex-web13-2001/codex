const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    color: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
