const Tag = require('../models/Tag');

const listTags = () => Tag.find().sort({ name: 1 });

const touchTags = (names) => Tag.touchMany(names);

const decrementUsage = async (names) => {
  if (!names?.length) {
    return;
  }
  await Tag.updateMany({ name: { $in: names } }, { $inc: { usageCount: -1 } });
  await Tag.deleteMany({ usageCount: { $lte: 0 } });
};

const createTag = async (_projectId, payload) => {
  const [tag] = await Tag.touchMany([payload.name]);
  return tag || (await Tag.findOne({ name: payload.name }));
};

const updateTag = (id, payload) => Tag.findByIdAndUpdate(id, payload, { new: true });

const deleteTag = (id) => Tag.findByIdAndDelete(id);

module.exports = {
  listTags,
  touchTags,
  decrementUsage,
  createTag,
  updateTag,
  deleteTag,
};
