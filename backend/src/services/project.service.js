const httpStatus = require('http-status');
const Project = require('../models/Project');
const Membership = require('../models/Membership');
const Column = require('../models/Column');
const Task = require('../models/Task');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const File = require('../models/File');
const ArchiveItem = require('../models/ArchiveItem');
const ApiError = require('../utils/ApiError');

const createProject = async (ownerId, data) => {
  const project = await Project.create({ ...data, owner: ownerId });
  await Membership.create({ project: project.id, user: ownerId, role: 'owner' });
  await Column.create({ name: 'Backlog', order: 0, project: project.id });
  return project;
};

const listProjects = async (userId) => {
  const memberships = await Membership.find({ user: userId }).populate('project');
  return memberships.map((membership) => membership.project).filter(Boolean);
};

const getProject = async (projectId, userId) => {
  const membership = await Membership.findOne({ project: projectId, user: userId });
  if (!membership) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  return Project.findById(projectId);
};

const updateProject = async (projectId, userId, update) => {
  const project = await getProject(projectId, userId);
  Object.assign(project, update);
  await project.save();
  return project;
};

const deleteProject = async (projectId, userId) => {
  const membership = await Membership.findOne({ project: projectId, user: userId, role: 'owner' });
  if (!membership) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only owner can delete project');
  }
  await Project.findByIdAndDelete(projectId);
  await Membership.deleteMany({ project: projectId });
  await Column.deleteMany({ project: projectId });
  await Task.deleteMany({ project: projectId });
  await Category.deleteMany({ project: projectId });
  await Tag.deleteMany({ project: projectId });
  await File.deleteMany({ project: projectId });
  await ArchiveItem.deleteMany({ project: projectId });
};

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
};
