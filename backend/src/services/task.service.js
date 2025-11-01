const httpStatus = require('http-status');
const Task = require('../models/Task');
const TaskHistory = require('../models/TaskHistory');
const Column = require('../models/Column');
const Project = require('../models/Project');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const tagService = require('./tag.service');

const sanitiseTags = (tags = []) => [...new Set(tags.map((tag) => tag?.trim()).filter(Boolean))];

const syncProjectTags = async (projectId) => {
  if (!projectId) {
    return;
  }
  const projectTags = await Task.distinct('tags', { project: projectId, archived: false });
  await Project.findByIdAndUpdate(projectId, { tags: projectTags });
};

const updateCategoryUsage = async (previousCategory, nextCategory) => {
  if (previousCategory && (!nextCategory || !previousCategory.equals(nextCategory))) {
    await Category.findByIdAndUpdate(previousCategory, { $inc: { usageCount: -1 } });
  }
  if (nextCategory && (!previousCategory || !previousCategory.equals(nextCategory))) {
    await Category.findByIdAndUpdate(nextCategory, { $inc: { usageCount: 1 } });
  }
};

const createTask = async (projectId, userId, payload) => {
  let column;
  if (payload.column) {
    column = await Column.findOne({ _id: payload.column, project: projectId });
  } else {
    column = await Column.findOne({ project: projectId }).sort({ order: 1 });
  }
  if (!column) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid column');
  }

  const tags = sanitiseTags(payload.tags);
  await tagService.touchTags(tags);
  if (payload.category) {
    await Category.findByIdAndUpdate(payload.category, { $inc: { usageCount: 1 } });
  }

  const deadline = payload.deadline ?? payload.dueDate;

  const task = await Task.create({
    title: payload.title,
    description: payload.description,
    project: projectId,
    column: column.id,
    author: userId,
    assignee: payload.assignee,
    category: payload.category,
    tags,
    priority: payload.priority || 'medium',
    status: column.title,
    deadline,
    order: payload.order ?? 0,
  });

  await TaskHistory.create({
    task: task.id,
    user: userId,
    type: 'created',
    newValue: {
      title: payload.title,
      column: column.id,
      tags,
      priority: payload.priority,
      assignee: payload.assignee,
    },
  });

  await syncProjectTags(projectId);

  return task;
};

const updateTask = async (taskId, userId, payload) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  let updatedColumn = task.column;
  if (payload.column) {
    const previousColumn = task.column;
    const previousStatus = task.status;
    const column = await Column.findOne({ _id: payload.column, project: task.project });
    if (!column) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid column');
    }
    task.column = column.id;
    task.status = column.title;
    updatedColumn = column.id;
    await TaskHistory.create({
      task: task.id,
      user: userId,
      type: 'statusChange',
      oldValue: { column: previousColumn, status: previousStatus },
      newValue: { column: updatedColumn, status: column.title },
    });
  }

  if (payload.title !== undefined) {
    task.title = payload.title;
  }
  if (payload.description !== undefined) {
    task.description = payload.description;
  }
  if (payload.assignee !== undefined) {
    await TaskHistory.create({
      task: task.id,
      user: userId,
      type: 'assigneeChange',
      oldValue: { assignee: task.assignee },
      newValue: { assignee: payload.assignee },
    });
    task.assignee = payload.assignee;
  }
  if (payload.priority) {
    task.priority = payload.priority;
    await TaskHistory.create({
      task: task.id,
      user: userId,
      type: 'priorityChange',
      newValue: { priority: payload.priority },
    });
  }
  if (payload.deadline !== undefined || payload.dueDate !== undefined) {
    task.deadline = payload.deadline ?? payload.dueDate;
  }

  if (payload.tags) {
    const nextTags = sanitiseTags(payload.tags);
    const removed = task.tags.filter((tag) => !nextTags.includes(tag));
    const added = nextTags.filter((tag) => !task.tags.includes(tag));
    if (added.length) {
      await tagService.touchTags(added);
    }
    if (removed.length) {
      await tagService.decrementUsage(removed);
    }
    task.tags = nextTags;
  }

  if (payload.category !== undefined) {
    await updateCategoryUsage(task.category, payload.category);
    task.category = payload.category;
  }

  if (typeof payload.order === 'number') {
    task.order = payload.order;
  }

  await task.save();
  await TaskHistory.create({ task: task.id, user: userId, type: 'edit', newValue: payload });

  await syncProjectTags(task.project);

  return task;
};

const moveTask = async (taskId, userId, { column, order }) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  const col = await Column.findOne({ _id: column, project: task.project });
  if (!col) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid column');
  }
  const previousColumn = task.column;
  const previousStatus = task.status;
  task.column = column;
  task.status = col.title;
  if (typeof order === 'number') {
    task.order = order;
  }
  await task.save();
  await TaskHistory.create({
    task: task.id,
    user: userId,
    type: 'statusChange',
    oldValue: { column: previousColumn, status: previousStatus },
    newValue: { column, status: col.title },
  });
  await syncProjectTags(task.project);
  return task;
};

const listProjectTasks = (projectId) =>
  Task.find({ project: projectId, archived: false })
    .populate('assignee', 'id name email avatarUrl')
    .populate('category')
    .sort({ column: 1, order: 1, createdAt: 1 });

const listPersonalTasks = (userId) =>
  Task.find({ personal: true, personalOwner: userId, archived: false }).sort({ order: 1, createdAt: 1 });

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return;
  }
  await updateCategoryUsage(task.category, null);
  if (task.tags?.length) {
    await tagService.decrementUsage(task.tags);
  }
  await Task.deleteOne({ _id: taskId });
  await TaskHistory.create({ task: task.id, user: userId, type: 'deleted', oldValue: { title: task.title } });
  await syncProjectTags(task.project);
};

module.exports = {
  createTask,
  updateTask,
  moveTask,
  listProjectTasks,
  listPersonalTasks,
  deleteTask,
};
