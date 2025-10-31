const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const projectService = require('../services/project.service');
const membershipService = require('../services/membership.service');
const invitationService = require('../services/invitation.service');
const columnService = require('../services/column.service');
const taskService = require('../services/task.service');
const categoryService = require('../services/category.service');
const tagService = require('../services/tag.service');
const archiveService = require('../services/archive.service');
const eventBus = require('../utils/eventBus');

exports.createProject = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.user.id, req.body);
  eventBus.emit('project:created', { project, userId: req.user.id });
  res.status(httpStatus.CREATED).json({ project });
});

exports.listProjects = catchAsync(async (req, res) => {
  const projects = await projectService.listProjects(req.user.id);
  res.status(httpStatus.OK).json({ projects });
});

exports.getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProject(req.params.projectId, req.user.id);
  res.status(httpStatus.OK).json({ project });
});

exports.updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProject(req.params.projectId, req.user.id, req.body);
  eventBus.emit('project:updated', { project });
  res.status(httpStatus.OK).json({ project });
});

exports.deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProject(req.params.projectId, req.user.id);
  eventBus.emit('project:deleted', { projectId: req.params.projectId });
  res.status(httpStatus.NO_CONTENT).send();
});

exports.listMembers = catchAsync(async (req, res) => {
  const members = await membershipService.listMembers(req.params.projectId);
  res.status(httpStatus.OK).json({ members });
});

exports.updateMemberRole = catchAsync(async (req, res) => {
  const membership = await membershipService.updateRole(
    req.params.projectId,
    req.params.membershipId,
    req.body.role,
    req.user.id
  );
  eventBus.emit('project:memberUpdated', { projectId: req.params.projectId, membership });
  res.status(httpStatus.OK).json({ membership });
});

exports.removeMember = catchAsync(async (req, res) => {
  await membershipService.removeMember(req.params.projectId, req.params.membershipId, req.user.id);
  eventBus.emit('project:memberRemoved', {
    projectId: req.params.projectId,
    membershipId: req.params.membershipId,
  });
  res.status(httpStatus.NO_CONTENT).send();
});

exports.createInvitation = catchAsync(async (req, res) => {
  const invitation = await invitationService.createInvitation(req.params.projectId, req.user, req.body);
  eventBus.emit('invitation:created', { projectId: req.params.projectId, invitation });
  res.status(httpStatus.CREATED).json({ invitation });
});

exports.listInvitations = catchAsync(async (req, res) => {
  const invitations = await invitationService.listInvitations(req.params.projectId);
  res.status(httpStatus.OK).json({ invitations });
});

exports.acceptInvitation = catchAsync(async (req, res) => {
  const invitation = await invitationService.acceptInvitation(req.body.token, req.user.id);
  eventBus.emit('invitation:accepted', { invitation, userId: req.user.id });
  res.status(httpStatus.OK).json({ invitation });
});

exports.createColumn = catchAsync(async (req, res) => {
  const column = await columnService.createColumn(req.params.projectId, req.body);
  eventBus.emit('column:created', { projectId: req.params.projectId, column });
  res.status(httpStatus.CREATED).json({ column });
});

exports.listColumns = catchAsync(async (req, res) => {
  const columns = await columnService.listColumns(req.params.projectId);
  res.status(httpStatus.OK).json({ columns });
});

exports.updateColumn = catchAsync(async (req, res) => {
  const column = await columnService.updateColumn(req.params.columnId, req.body);
  eventBus.emit('column:updated', { projectId: req.params.projectId, column });
  res.status(httpStatus.OK).json({ column });
});

exports.deleteColumn = catchAsync(async (req, res) => {
  await columnService.deleteColumn(req.params.columnId);
  eventBus.emit('column:deleted', { projectId: req.params.projectId, columnId: req.params.columnId });
  res.status(httpStatus.NO_CONTENT).send();
});

exports.createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.params.projectId, req.user.id, req.body);
  eventBus.emit('task:created', { projectId: req.params.projectId, task });
  res.status(httpStatus.CREATED).json({ task });
});

exports.listTasks = catchAsync(async (req, res) => {
  const tasks = await taskService.listProjectTasks(req.params.projectId);
  res.status(httpStatus.OK).json({ tasks });
});

exports.updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.taskId, req.user.id, req.body);
  eventBus.emit('task:updated', { projectId: req.params.projectId, task });
  res.status(httpStatus.OK).json({ task });
});

exports.moveTask = catchAsync(async (req, res) => {
  const task = await taskService.moveTask(req.params.taskId, req.user.id, req.body);
  eventBus.emit('task:moved', { projectId: req.params.projectId, task });
  res.status(httpStatus.OK).json({ task });
});

exports.deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.params.taskId, req.user.id);
  eventBus.emit('task:deleted', { projectId: req.params.projectId, taskId: req.params.taskId });
  res.status(httpStatus.NO_CONTENT).send();
});

exports.listPersonalTasks = catchAsync(async (req, res) => {
  const tasks = await taskService.listPersonalTasks(req.user.id);
  res.status(httpStatus.OK).json({ tasks });
});

exports.createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.params.projectId, req.body);
  eventBus.emit('category:created', { projectId: req.params.projectId, category });
  res.status(httpStatus.CREATED).json({ category });
});

exports.listCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.listCategories(req.params.projectId);
  res.status(httpStatus.OK).json({ categories });
});

exports.updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.categoryId, req.body);
  eventBus.emit('category:updated', { projectId: req.params.projectId, category });
  res.status(httpStatus.OK).json({ category });
});

exports.deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.categoryId);
  eventBus.emit('category:deleted', { projectId: req.params.projectId, categoryId: req.params.categoryId });
  res.status(httpStatus.NO_CONTENT).send();
});

exports.createTag = catchAsync(async (req, res) => {
  const tag = await tagService.createTag(req.params.projectId, req.body);
  eventBus.emit('tag:created', { projectId: req.params.projectId, tag });
  res.status(httpStatus.CREATED).json({ tag });
});

exports.listTags = catchAsync(async (req, res) => {
  const tags = await tagService.listTags(req.params.projectId);
  res.status(httpStatus.OK).json({ tags });
});

exports.updateTag = catchAsync(async (req, res) => {
  const tag = await tagService.updateTag(req.params.tagId, req.body);
  eventBus.emit('tag:updated', { projectId: req.params.projectId, tag });
  res.status(httpStatus.OK).json({ tag });
});

exports.deleteTag = catchAsync(async (req, res) => {
  await tagService.deleteTag(req.params.tagId);
  eventBus.emit('tag:deleted', { projectId: req.params.projectId, tagId: req.params.tagId });
  res.status(httpStatus.NO_CONTENT).send();
});

exports.archiveTask = catchAsync(async (req, res) => {
  const item = await archiveService.archiveTask(req.params.taskId, req.user.id);
  eventBus.emit('task:archived', { projectId: req.params.projectId, item });
  res.status(httpStatus.OK).json({ item });
});

exports.archiveColumn = catchAsync(async (req, res) => {
  const item = await archiveService.archiveColumn(req.params.columnId, req.user.id);
  eventBus.emit('column:archived', { projectId: req.params.projectId, item });
  res.status(httpStatus.OK).json({ item });
});

exports.listArchive = catchAsync(async (req, res) => {
  const items = await archiveService.listArchive(req.params.projectId);
  res.status(httpStatus.OK).json({ items });
});
