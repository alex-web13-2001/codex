const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const fileService = require('../services/file.service');
const fileRecordService = require('../services/fileRecord.service');

exports.upload = catchAsync(async (req, res) => {
  if (!req.file) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'Файл обязателен для загрузки' });
    return;
  }

  const uploaded = await fileService.upload({
    buffer: req.file.buffer,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });

  const record = await fileRecordService.createFileRecord({
    project: req.params.projectId,
    task: req.params.taskId,
    owner: req.user.id,
    originalName: uploaded.originalName,
    storageKey: uploaded.storageKey,
    mimeType: uploaded.mimeType,
    size: uploaded.size,
    url: uploaded.url,
  });

  res.status(httpStatus.CREATED).json({ file: record });
});

exports.list = catchAsync(async (req, res) => {
  const files = await fileRecordService.listFiles(req.params.projectId, req.params.taskId);
  res.status(httpStatus.OK).json({ files });
});

exports.remove = catchAsync(async (req, res) => {
  const file = await fileRecordService.deleteFileRecord(req.params.fileId);
  if (file) {
    await fileService.delete(file.storageKey);
  }
  res.status(httpStatus.NO_CONTENT).send();
});
