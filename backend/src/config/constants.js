module.exports = {
  PROJECT_STATUS: {
    ACTIVE: 'active',
    ARCHIVED: 'archived',
  },
  DEFAULT_PROJECT_COLUMNS: [
    { key: 'assigned', title: 'Assigned', order: 0, isDefault: true },
    { key: 'in_progress', title: 'In Progress', order: 1, isDefault: false },
    { key: 'done', title: 'Done', order: 2, isDefault: true },
  ],
  TASK_PRIORITIES: ['low', 'medium', 'high', 'urgent'],
  FILE_LIMITS: {
    PROJECT: {
      MAX_FILES: 10,
      MAX_TOTAL_BYTES: 200 * 1024 * 1024,
    },
    TASK: {
      MAX_FILES: 5,
      MAX_TOTAL_BYTES: 100 * 1024 * 1024,
    },
  },
  ALLOWED_FILE_MIME_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg',
    'application/zip',
  ],
};
