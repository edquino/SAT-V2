const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const {modulesList, viewCreateModule, createModule, getById, updateModule} = require('@controllers/front/modules.controllers');

router.get('/api-sat/modules-list', isLoggedIn, modulesList);

router.get('/api-sat/modules/create-view', isLoggedIn, viewCreateModule);
router.post('/api-sat/modules/create', isLoggedIn, createModule);

router.get('/api-sat/modules/:id_modulo/update-view', isLoggedIn, getById);
router.post('/api-sat/modules/:id_modulo/update', isLoggedIn, updateModule);

module.exports = router;