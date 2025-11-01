const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

tagSchema.statics.touchMany = async function (names) {
  if (!names?.length) {
    return [];
  }

  const uniqueNames = [...new Set(names.map((name) => name.trim()).filter(Boolean))];
  const operations = uniqueNames.map((name) => ({
    updateOne: {
      filter: { name },
      update: { $setOnInsert: { name }, $inc: { usageCount: 1 } },
      upsert: true,
    },
  }));

  if (!operations.length) {
    return [];
  }

  await this.bulkWrite(operations);
  return this.find({ name: { $in: uniqueNames } });
};

tagSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

tagSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Tag', tagSchema);
