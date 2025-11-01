const httpStatus = require('http-status');
const Column = require('../models/Column');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');

const createColumn = async (projectId, payload) => {
  const order =
    typeof payload.order === 'number'
      ? payload.order
      : await Column.countDocuments({ project: projectId, scope: 'project' });
  return Column.create({
    title: payload.title?.trim(),
    key: payload.key?.trim(),
    order,
    project: projectId,
    scope: 'project',
    isDefault: Boolean(payload.isDefault),
  });
};

const listColumns = (projectId) => Column.find({ project: projectId }).sort({ order: 1 });

const updateColumn = async (columnId, payload) => {
  const column = await Column.findById(columnId);
  if (!column) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Column not found');
  }
  if (column.isDefault && payload.title && payload.title !== column.title) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Нельзя переименовать системную колонку');
  }
  Object.assign(column, {
    title: payload.title ?? column.title,
    key: payload.key ?? column.key,
    order: typeof payload.order === 'number' ? payload.order : column.order,
  });
  await column.save();
  return column;
};

const deleteColumn = async (columnId) => {
  const column = await Column.findById(columnId);
  if (!column) {
    return;
  }
  if (column.isDefault) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Нельзя удалить системную колонку');
  }
  const tasksCount = await Task.countDocuments({ column: columnId });
  if (tasksCount > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Нельзя удалить колонку, пока в ней есть задачи');
  }
  await Column.deleteOne({ _id: columnId });
};

module.exports = {
  createColumn,
  listColumns,
  updateColumn,
  deleteColumn,
};
