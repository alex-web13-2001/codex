const Category = require('../models/Category');

const createCategory = (projectId, payload) => Category.create({ ...payload, project: projectId });
const listCategories = (projectId) => Category.find({ project: projectId });
const updateCategory = (id, payload) => Category.findByIdAndUpdate(id, payload, { new: true });
const deleteCategory = (id) => Category.findByIdAndDelete(id);

module.exports = {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
};
