const express = require('express');
const multer = require('multer');
const projectController = require('../../controllers/project.controller');
const fileController = require('../../controllers/file.controller');
const { auth, authorizeProjectRole } = require('../../middlewares/auth');
const projectMembership = require('../../middlewares/projectMembership');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth(), projectController.createProject);
router.get('/', auth(), projectController.listProjects);
router.get('/personal/tasks', auth(), projectController.listPersonalTasks);
router.get('/:projectId', auth(), projectMembership, projectController.getProject);
router.patch(
  '/:projectId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.updateProject
);
router.delete(
  '/:projectId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner']),
  projectController.deleteProject
);

router.get('/:projectId/members', auth(), projectMembership, projectController.listMembers);
router.patch(
  '/:projectId/members/:membershipId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.updateMemberRole
);
router.delete(
  '/:projectId/members/:membershipId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.removeMember
);

router.post(
  '/:projectId/invitations',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.createInvitation
);
router.get('/:projectId/invitations', auth(), projectMembership, projectController.listInvitations);
router.post('/invitations/accept', auth(), projectController.acceptInvitation);

router.post(
  '/:projectId/columns',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.createColumn
);
router.get('/:projectId/columns', auth(), projectMembership, projectController.listColumns);
router.patch(
  '/:projectId/columns/:columnId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.updateColumn
);
router.delete(
  '/:projectId/columns/:columnId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.deleteColumn
);

router.post('/:projectId/tasks', auth(), projectMembership, projectController.createTask);
router.get('/:projectId/tasks', auth(), projectMembership, projectController.listTasks);
router.patch('/:projectId/tasks/:taskId', auth(), projectMembership, projectController.updateTask);
router.post('/:projectId/tasks/:taskId/move', auth(), projectMembership, projectController.moveTask);
router.delete('/:projectId/tasks/:taskId', auth(), projectMembership, projectController.deleteTask);
router.post('/:projectId/tasks/:taskId/archive', auth(), projectMembership, projectController.archiveTask);

router.post(
  '/:projectId/categories',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.createCategory
);
router.get('/:projectId/categories', auth(), projectMembership, projectController.listCategories);
router.patch(
  '/:projectId/categories/:categoryId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.updateCategory
);
router.delete(
  '/:projectId/categories/:categoryId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.deleteCategory
);

router.post(
  '/:projectId/tags',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.createTag
);
router.get('/:projectId/tags', auth(), projectMembership, projectController.listTags);
router.patch(
  '/:projectId/tags/:tagId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.updateTag
);
router.delete(
  '/:projectId/tags/:tagId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.deleteTag
);

router.get('/:projectId/archive', auth(), projectMembership, projectController.listArchive);
router.post(
  '/:projectId/columns/:columnId/archive',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  projectController.archiveColumn
);

router.post(
  '/:projectId/tasks/:taskId/files',
  auth(),
  projectMembership,
  upload.single('file'),
  fileController.upload
);
router.get('/:projectId/tasks/:taskId/files', auth(), projectMembership, fileController.list);
router.delete(
  '/:projectId/files/:fileId',
  auth(),
  projectMembership,
  authorizeProjectRole(['owner', 'admin']),
  fileController.remove
);

module.exports = router;
