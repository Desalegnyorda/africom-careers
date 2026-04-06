const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/cv directory exists
const uploadDir = path.join(__dirname, '../../uploads/cv');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 1. Get the extension (forcing .pdf check)
    const ext = path.extname(file.originalname).toLowerCase();
    
    // 2. Clean the filename (remove spaces, lowercase)
    const name = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '-')
      .toLowerCase();

    // 3. Final format: cv-17053456789-my-resume.pdf
    cb(null, `cv-${Date.now()}-${name}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Strict check: Both MIME type and extension must be PDF
  if (file.mimetype === 'application/pdf' && ext === '.pdf') {
    cb(null, true);
  } else {
    // This error message will be caught by your global error middleware
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;