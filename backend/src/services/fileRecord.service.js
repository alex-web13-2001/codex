const httpStatus = require('http-status');
const File = require('../models/File');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const { FILE_LIMITS } = require('../config/constants');

const aggregateSize = async (filters) => {
  const [result] = await File.aggregate([
    { $match: filters },
    { $group: { _id: null, total: { $sum: '$size' }, count: { $sum: 1 } } },
  ]);
  return { total: result?.total || 0, count: result?.count || 0 };
};

const enforceLimits = async ({ projectId, taskId, size }) => {
  if (projectId) {
    const { count, total } = await aggregateSize({ project: projectId });
    if (count + 1 > FILE_LIMITS.PROJECT.MAX_FILES) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Превышено максимальное количество файлов проекта (10)');
    }
    if (total + size > FILE_LIMITS.PROJECT.MAX_TOTAL_BYTES) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Превышен суммарный размер файлов проекта (200 МБ)');
    }
  }

  if (taskId) {
    const { count, total } = await aggregateSize({ task: taskId });
    if (count + 1 > FILE_LIMITS.TASK.MAX_FILES) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Превышено максимальное количество файлов задачи (5)');
    }
    if (total + size > FILE_LIMITS.TASK.MAX_TOTAL_BYTES) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Превышен суммарный размер файлов задачи (100 МБ)');
    }
  }
};

const createFileRecord = async ({ project, task, owner, ...rest }) => {
  await enforceLimits({ projectId: project, taskId: task, size: rest.size });
  const file = await File.create({ project, task, owner, ...rest });

  if (project) {
    await Project.findByIdAndUpdate(project, { $addToSet: { files: file._id } });
  }
  if (task) {
    await Task.findByIdAndUpdate(task, { $addToSet: { files: file._id } });
  }
  return file;
};

const listFiles = (projectId, taskId) => {
  const filters = {};
  if (projectId) {
    filters.project = projectId;
  }
  if (taskId) {
    filters.task = taskId;
  }
  return File.find(filters).sort({ createdAt: -1 });
};

const deleteFileRecord = async (id) => {
  const file = await File.findById(id);
  if (!file) {
    return null;
  }
  await File.deleteOne({ _id: id });
  if (file.project) {
    await Project.findByIdAndUpdate(file.project, { $pull: { files: file._id } });
  }
  if (file.task) {
    await Task.findByIdAndUpdate(file.task, { $pull: { files: file._id } });
  }
  return file;
};

module.exports = {
  createFileRecord,
  listFiles,
  deleteFileRecord,
};
