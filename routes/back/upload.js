const { Router } = require('express');
const router = Router();
const { upload } = require('../../controllers/back/upload-image');
const multer = require('@lib/multer');
router.post('/api/uploads', multer.single('file'),upload);

module.exports = router;