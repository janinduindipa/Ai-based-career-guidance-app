'use strict';
const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { parseCV }     = require('../controllers/cvController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB (images can be larger)
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    const allowedExts = /\.(pdf|doc|docx|txt|jpg|jpeg|png|webp)$/i;
    if (allowedMimes.includes(file.mimetype) || allowedExts.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Allowed formats: PDF, DOC, DOCX, TXT, JPG, PNG'));
    }
  },
});

// Wrap multer so its errors return JSON (not HTML)
router.post('/parse', verifyToken, (req, res, next) => {
  upload.single('cv')(req, res, (err) => {
    if (err) {
      // multer file size / type errors → JSON 400
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, parseCV);

module.exports = router;
