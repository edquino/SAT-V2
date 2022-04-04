const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { temporalityList, viewCreateTemporality, createTemporality, getById, updateTemporality } = require('@controllers/front/temporality.controllers');

router.get('/api-sat/temporality-list', isLoggedIn, temporalityList);

router.get('/api-sat/temporality/view-create', isLoggedIn, viewCreateTemporality);
router.post('/api-sat/temporality/create', isLoggedIn, createTemporality);

router.get('/api-sat/temporality/:id_temporalidad/view-update', isLoggedIn, getById);
router.post('/api-sat/temporality/:id_temporalidad/update', isLoggedIn, updateTemporality);

module.exports = router;