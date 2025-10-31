const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'member' },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invitation', invitationSchema);
