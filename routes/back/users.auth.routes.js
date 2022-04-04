const { Router } = require('express');
const router = Router();
const { login,refreshToken, profile } = require('@controllers/back/users.auth.controller');
const { usersTokenVerification } = require('@middlewares/token.middleware');

router.post('/api/login', login);
router.post('/api/refreshToken', refreshToken);
router.get('/api/profile', usersTokenVerification, profile);

module.exports = router;