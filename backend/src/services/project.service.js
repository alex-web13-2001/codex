const httpStatus = require('http-status');
const Project = require('../models/Project');
const Membership = require('../models/Membership');
const Column = require('../models/Column');
const Task = require('../models/Task');
const ArchiveItem = require('../models/ArchiveItem');
const File = require('../models/File');
const ApiError = require('../utils/ApiError');
const { DEFAULT_PROJECT_COLUMNS, PROJECT_STATUS } = require('../config/constants');

const normaliseProjectPayload = (data = {}) => {
  const payload = { ...data };
  if (payload.name && !payload.title) {
    payload.title = payload.name;
  }
  delete payload.name;

  if (payload.tags) {
    payload.tags = payload.tags.filter(Boolean).map((tag) => tag.trim());
  }

  if (payload.links) {
    payload.links = payload.links
      .map((link) => ({
        title: link.title?.trim(),
        url: link.url?.trim(),
      }))
      .filter((link) => link.title && link.url);
  }

  return payload;
};

const createProject = async (ownerId, data) => {
  const payload = normaliseProjectPayload(data);
  const project = await Project.create({ ...payload, owner: ownerId });
  await Membership.create({ project: project.id, user: ownerId, role: 'owner' });

  const columns = DEFAULT_PROJECT_COLUMNS.map((column) => ({
    title: column.title,
    key: column.key,
    order: column.order,
    project: project.id,
    scope: 'project',
    isDefault: column.isDefault,
  }));
  await Column.insertMany(columns);

  return project;
};

const listProjects = async (userId) => {
  const memberships = await Membership.find({ user: userId }).populate({
    path: 'project',
    populate: [
      { path: 'owner', select: 'id name email avatarUrl' },
      { path: 'categories' }
    ],
  });
  const projects = memberships
    .map((membership) => membership.project)
    .filter(Boolean)
    .map((project) => project.toJSON());

  const projectIds = projects.map((project) => project.id);
  const members = await Membership.find({ project: { $in: projectIds } })
    .populate('user', 'id name email avatarUrl')
    .lean();

  const membersByProject = members.reduce((acc, membership) => {
    const projectId = membership.project.toString();
    if (!acc[projectId]) {
      acc[projectId] = [];
    }
    acc[projectId].push({
      id: membership.user._id.toString(),
      name: membership.user.name,
      email: membership.user.email,
      avatarUrl: membership.user.avatarUrl,
      role: membership.role,
    });
    return acc;
  }, {});

  return projects.map((project) => ({
    ...project,
    members: membersByProject[project.id] ?? [],
  }));
};

const getProject = async (projectId, userId) => {
  const membership = await Membership.findOne({ project: projectId, user: userId });
  if (!membership) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  return Project.findById(projectId)
    .populate('categories')
    .populate('owner', 'id name email avatarUrl')
    .populate({ path: 'files', select: 'originalName size url createdAt' });
};

const updateProject = async (projectId, userId, update) => {
  const project = await getProject(projectId, userId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  const payload = normaliseProjectPayload(update);
  Object.assign(project, payload);
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
  await ArchiveItem.deleteMany({ project: projectId });
  await File.deleteMany({ project: projectId });
};

const archiveProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  if (!project.owner.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only owner can archive project');
  }
  project.status = PROJECT_STATUS.ARCHIVED;
  project.archivedAt = new Date();
  project.archivedBy = userId;
  await project.save();
  await Task.updateMany({ project: projectId }, { archived: true, archivedAt: new Date(), archivedBy: userId });
  return project;
};

const restoreProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  if (!project.owner.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only owner can restore project');
  }
  project.status = PROJECT_STATUS.ACTIVE;
  project.archivedAt = null;
  project.archivedBy = null;
  await project.save();
  await Task.updateMany({ project: projectId }, { archived: false, archivedAt: null, archivedBy: null });
  return project;
};

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  archiveProject,
  restoreProject,
};
