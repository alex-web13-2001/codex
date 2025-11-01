# 24Task Compliance Review

This document captures the gaps observed between the current implementation and the stage 1 requirements defined in the 24Task specification.

## Personal workspace
- The backend exposes only a read-only endpoint for personal tasks (`GET /projects/personal/tasks`) and lacks APIs to create columns or tasks in a personal scope, so users cannot maintain an independent personal Kanban as required.
- The frontend "My tasks" page simply aggregates project tasks and does not call any personal-task API, preventing separation of private work from shared project work.

## Kanban flexibility and task metadata
- Project boards are constrained to three hard-coded statuses (Assigned, In Progress, Done); there is no UI to add, rename, or order custom columns, and task creation assumes only these defaults.
- Task forms omit mandatory metadata from the spec (priority selector with 🔥, category chooser, tag chips, assignee assignment, deadline highlighting) and never upload the files selected via drag-and-drop.

## Invitations and membership roles
- Collaborators are allowed to send invitations even though the role matrix restricts this ability to owners.
- The invitation page on the frontend only stores email addresses locally and never reaches the API to generate a tokenised invite or send email.

## Real-time updates
- The Socket.IO client never authenticates or subscribes to project/user rooms, while the server expects `userId`/`projectId` identifiers at connection time. As a result, Kanban events are not broadcast to the appropriate audience.

## Dashboard and cross-project visibility
- The dashboard fetches tasks for only the first project returned by the API, falls back to static mocks on failure, and lacks the global filters (project, status, priority, category, tag, executor, deadline) required for a unified overview.

## File management
- Upload validation on the backend enforces per-project and per-task limits, but the API route that deletes files requires an `admin` membership role that is never defined, effectively preventing collaborators and owners from removing attachments.
- On the frontend, uploaded files are not persisted; the hook just buffers them in memory without making an API request, so the attachment workflow is incomplete.

