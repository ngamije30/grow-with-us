import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Define file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        'Error: File upload only supports the following filetypes - ' +
          filetypes
      )
    );
  }
};

// Initialize upload for general files
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter,
});

// Initialize upload for profile images with specific settings
export const uploadProfileImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
  fileFilter: (req, file, cb) => {
    // Allowed file extensions for images only
    const filetypes = /jpeg|jpg|png/;
    // Check extension
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          'Error: Profile image upload only supports the following filetypes - ' +
            filetypes
        )
      );
    }
  },
});
