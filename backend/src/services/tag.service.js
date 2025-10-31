const Tag = require('../models/Tag');

const createTag = (projectId, payload) => Tag.create({ ...payload, project: projectId });
const listTags = (projectId) => Tag.find({ project: projectId });
const updateTag = (id, payload) => Tag.findByIdAndUpdate(id, payload, { new: true });
const deleteTag = (id) => Tag.findByIdAndDelete(id);

module.exports = {
  createTag,
  listTags,
  updateTag,
  deleteTag,
};
