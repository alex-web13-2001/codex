const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    color: { type: String, default: '#A0AEC0' },
    description: { type: String, default: '' },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

categorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);
