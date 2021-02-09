import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFilename = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFilename,
  storage: multer.diskStorage({
    destination: tmpFilename,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
