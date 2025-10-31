const Column = require('../models/Column');
const Task = require('../models/Task');

const createColumn = (projectId, payload) => Column.create({ ...payload, project: projectId });
const listColumns = (projectId) => Column.find({ project: projectId }).sort({ order: 1 });
const updateColumn = async (columnId, payload) => {
  const column = await Column.findById(columnId);
  if (!column) {
    return null;
  }
  Object.assign(column, payload);
  await column.save();
  return column;
};

const deleteColumn = async (columnId) => {
  await Task.updateMany({ column: columnId }, { $set: { column: null } });
  await Column.findByIdAndDelete(columnId);
};

module.exports = {
  createColumn,
  listColumns,
  updateColumn,
  deleteColumn,
};
