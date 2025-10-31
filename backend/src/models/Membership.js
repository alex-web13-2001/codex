const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'admin', 'member', 'viewer'], default: 'member' },
  },
  { timestamps: true }
);

membershipSchema.index({ project: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Membership', membershipSchema);
