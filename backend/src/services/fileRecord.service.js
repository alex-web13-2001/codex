const File = require('../models/File');

const createFileRecord = (data) => File.create(data);
const listFiles = (projectId, taskId) =>
  File.find({ project: projectId, ...(taskId ? { task: taskId } : {}) }).sort({ createdAt: -1 });
const deleteFileRecord = (id) => File.findByIdAndDelete(id);

module.exports = {
  createFileRecord,
  listFiles,
  deleteFileRecord,
};
