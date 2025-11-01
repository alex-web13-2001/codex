const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const env = require('../config/env');
const { ALLOWED_FILE_MIME_TYPES } = require('../config/constants');

class FileService {
  constructor() {
    this.driver = env.fileStorage.driver;
    if (this.driver === 'local') {
      this.basePath = path.resolve(process.cwd(), env.fileStorage.localPath);
      if (!fs.existsSync(this.basePath)) {
        fs.mkdirSync(this.basePath, { recursive: true });
      }
    }
  }

  validateFile({ mimetype, size, originalName }) {
    if (!ALLOWED_FILE_MIME_TYPES.includes(mimetype)) {
      throw new Error(`Формат файла "${originalName}" не поддерживается`);
    }
    if (size > 50 * 1024 * 1024) {
      throw new Error('Размер файла не должен превышать 50 МБ');
    }
  }

  async upload({ buffer, originalName, mimetype, size }) {
    this.validateFile({ mimetype, size, originalName });

    if (this.driver !== 'local') {
      throw new Error('Only local storage driver is implemented in this environment');
    }
    const ext = path.extname(originalName);
    const fileName = `${uuid()}${ext}`;
    const storageKey = path.join(env.fileStorage.localPath, fileName);
    const targetPath = path.join(this.basePath, fileName);
    await fs.promises.writeFile(targetPath, buffer);
    return {
      storageKey,
      url: `${env.baseUrl}/files/${fileName}`,
      originalName,
      mimeType: mimetype,
      size,
    };
  }

  async delete(storageKey) {
    if (this.driver !== 'local') {
      return;
    }
    const filePath = path.resolve(process.cwd(), storageKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}

module.exports = new FileService();
