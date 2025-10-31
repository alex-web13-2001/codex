const ArchiveItem = require('../models/ArchiveItem');
const Task = require('../models/Task');
const Column = require('../models/Column');

const archiveTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return null;
  }
  await ArchiveItem.create({
    project: task.project,
    type: 'task',
    payload: task.toObject(),
    archivedBy: userId,
  });
  await Task.deleteOne({ _id: taskId });
  return task;
};

const archiveColumn = async (columnId, userId) => {
  const column = await Column.findById(columnId);
  if (!column) {
    return null;
  }
  await ArchiveItem.create({
    project: column.project,
    type: 'column',
    payload: column.toObject(),
    archivedBy: userId,
  });
  await Column.deleteOne({ _id: columnId });
  return column;
};

const listArchive = (projectId) => ArchiveItem.find({ project: projectId }).sort({ createdAt: -1 });

module.exports = {
  archiveTask,
  archiveColumn,
  listArchive,
};
