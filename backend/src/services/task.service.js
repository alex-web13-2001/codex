const httpStatus = require('http-status');
const Task = require('../models/Task');
const TaskHistory = require('../models/TaskHistory');
const Column = require('../models/Column');
const ApiError = require('../utils/ApiError');

const createTask = async (projectId, userId, payload) => {
  const column = await Column.findOne({ _id: payload.column, project: projectId });
  if (!column) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid column');
  }
  const task = await Task.create({ ...payload, project: projectId });
  await TaskHistory.create({ task: task.id, user: userId, action: 'created', payload });
  return task;
};

const updateTask = async (taskId, userId, payload) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  if (payload.column) {
    const column = await Column.findOne({ _id: payload.column, project: task.project });
    if (!column) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid column');
    }
  }
  Object.assign(task, payload);
  await task.save();
  await TaskHistory.create({ task: task.id, user: userId, action: 'updated', payload });
  return task;
};

const moveTask = async (taskId, userId, { column, order }) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  if (column) {
    const col = await Column.findOne({ _id: column, project: task.project });
    if (!col) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid column');
    }
    task.column = column;
  }
  if (typeof order === 'number') {
    task.order = order;
  }
  await task.save();
  await TaskHistory.create({ task: task.id, user: userId, action: 'moved', payload: { column, order } });
  return task;
};

const listProjectTasks = (projectId) => Task.find({ project: projectId }).sort({ order: 1 });
const listPersonalTasks = (userId) => Task.find({ assignee: userId, isPersonal: true });

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return;
  }
  await Task.deleteOne({ _id: taskId });
  await TaskHistory.create({ task: task.id, user: userId, action: 'deleted', payload: {} });
};

module.exports = {
  createTask,
  updateTask,
  moveTask,
  listProjectTasks,
  listPersonalTasks,
  deleteTask,
};
