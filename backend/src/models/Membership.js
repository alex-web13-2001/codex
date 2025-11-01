const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: ['owner', 'collaborator', 'member', 'viewer'],
      default: 'member',
    },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

membershipSchema.index({ project: 1, user: 1 }, { unique: true });

membershipSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

membershipSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Membership', membershipSchema);
