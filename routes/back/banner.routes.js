const { Router } = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { bannerList } = require('@controllers/back/banner.controllers');

router.get('/api/banner', bannerList);

module.exports = router;

