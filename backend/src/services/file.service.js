const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const env = require('../config/env');

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

  async upload({ buffer, originalName, mimetype }) {
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
