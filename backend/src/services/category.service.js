const Category = require('../models/Category');

const createCategory = (payload) => Category.create(payload);
const listCategories = () => Category.find().sort({ title: 1 });
const updateCategory = (id, payload) => Category.findByIdAndUpdate(id, payload, { new: true });
const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    return null;
  }
  await Category.deleteOne({ _id: id });
  const Task = require('../models/Task');
  await Task.updateMany({ category: id }, { $set: { category: null } });
  return category;
};

module.exports = {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
};
