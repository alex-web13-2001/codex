const ArchiveItem = require('../models/ArchiveItem');
const Task = require('../models/Task');
const Column = require('../models/Column');

const archiveTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return null;
  }
  task.archived = true;
  task.archivedAt = new Date();
  task.archivedBy = userId;
  await task.save();
  await ArchiveItem.findOneAndUpdate(
    { objectRef: task.id, type: 'task' },
    {
      project: task.project,
      type: 'task',
      objectRef: task.id,
      payload: task.toObject(),
      archivedBy: userId,
      archivedAt: new Date(),
      restored: false,
    },
    { upsert: true, new: true }
  );
  return task;
};

const archiveColumn = async (columnId, userId) => {
  const column = await Column.findById(columnId);
  if (!column) {
    return null;
  }
  await ArchiveItem.findOneAndUpdate(
    { objectRef: column.id, type: 'column' },
    {
      project: column.project,
      type: 'column',
      objectRef: column.id,
      payload: column.toObject(),
      archivedBy: userId,
      archivedAt: new Date(),
      restored: false,
    },
    { upsert: true, new: true }
  );
  await Column.deleteOne({ _id: columnId });
  return column;
};

const listArchive = (projectId) => ArchiveItem.find({ project: projectId }).sort({ createdAt: -1 });

module.exports = {
  archiveTask,
  archiveColumn,
  listArchive,
};
