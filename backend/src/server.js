const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const { connect } = require('./config/mongoose');
const createGateway = require('./websocket/index');
const eventBus = require('./utils/eventBus');

const start = async () => {
  await connect();
  const server = http.createServer(app);
  const gateway = createGateway(server);

  eventBus.on('task:created', ({ projectId, task }) => gateway.emitTaskEvent(projectId, 'created', task));
  eventBus.on('task:updated', ({ projectId, task }) => gateway.emitTaskEvent(projectId, 'updated', task));
  eventBus.on('task:moved', ({ projectId, task }) => gateway.emitTaskEvent(projectId, 'moved', task));
  eventBus.on('task:deleted', ({ projectId, taskId }) => gateway.emitTaskEvent(projectId, 'deleted', { taskId }));
  eventBus.on('task:archived', ({ projectId, item }) => gateway.emitTaskEvent(projectId, 'archived', item));

  eventBus.on('project:created', ({ project }) => gateway.emitProjectEvent(project.id, 'created', project));
  eventBus.on('project:updated', ({ project }) => gateway.emitProjectEvent(project.id, 'updated', project));
  eventBus.on('project:deleted', ({ projectId }) => gateway.emitProjectEvent(projectId, 'deleted', { projectId }));
  eventBus.on('project:memberUpdated', ({ projectId, membership }) =>
    gateway.emitProjectEvent(projectId, 'memberUpdated', membership)
  );
  eventBus.on('project:memberRemoved', ({ projectId, membershipId }) =>
    gateway.emitProjectEvent(projectId, 'memberRemoved', { membershipId })
  );

  eventBus.on('column:created', ({ projectId, column }) => gateway.emitProjectEvent(projectId, 'columnCreated', column));
  eventBus.on('column:updated', ({ projectId, column }) => gateway.emitProjectEvent(projectId, 'columnUpdated', column));
  eventBus.on('column:deleted', ({ projectId, columnId }) =>
    gateway.emitProjectEvent(projectId, 'columnDeleted', { columnId })
  );
  eventBus.on('column:archived', ({ projectId, item }) => gateway.emitProjectEvent(projectId, 'columnArchived', item));

  eventBus.on('category:created', ({ projectId, category }) => gateway.emitProjectEvent(projectId, 'categoryCreated', category));
  eventBus.on('category:updated', ({ projectId, category }) => gateway.emitProjectEvent(projectId, 'categoryUpdated', category));
  eventBus.on('category:deleted', ({ projectId, categoryId }) =>
    gateway.emitProjectEvent(projectId, 'categoryDeleted', { categoryId })
  );

  eventBus.on('tag:created', ({ projectId, tag }) => gateway.emitProjectEvent(projectId, 'tagCreated', tag));
  eventBus.on('tag:updated', ({ projectId, tag }) => gateway.emitProjectEvent(projectId, 'tagUpdated', tag));
  eventBus.on('tag:deleted', ({ projectId, tagId }) => gateway.emitProjectEvent(projectId, 'tagDeleted', { tagId }));

  eventBus.on('invitation:created', ({ projectId, invitation }) =>
    gateway.emitProjectEvent(projectId, 'invitationCreated', invitation)
  );
  eventBus.on('invitation:accepted', ({ invitation, userId }) =>
    gateway.emitInvitationEvent(userId, { invitationId: invitation.id, projectId: invitation.project })
  );

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${env.port}`);
  });

  const gracefulShutdown = async () => {
    await mongoose.connection.close();
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
};

start();
