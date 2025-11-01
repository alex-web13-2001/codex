const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    key: { type: String, trim: true },
    order: { type: Number, default: 0 },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scope: { type: String, enum: ['project', 'personal'], default: 'project' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

columnSchema.pre('validate', function validateScope(next) {
  if (this.scope === 'project' && !this.project) {
    next(new Error('Project columns must have project reference'));
    return;
  }
  if (this.scope === 'personal' && !this.owner) {
    next(new Error('Personal columns must have owner reference'));
    return;
  }
  next();
});

columnSchema.index({ project: 1, order: 1 });
columnSchema.index({ owner: 1, order: 1 });

columnSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

columnSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Column', columnSchema);
