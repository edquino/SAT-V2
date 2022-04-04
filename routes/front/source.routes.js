const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { sourceList, viewSource, createSource, getById, updateSource } = require('@controllers/front/source.controllers');

// get source list
router.get('/api-sat/source-list', isLoggedIn, sourceList);

// source create
router.get('/api-sat/source/view-create', isLoggedIn, viewSource);
router.post('/api-sat/source/create', isLoggedIn, createSource);

// source edit
router.get('/api-sat/source/:id_fuente/edit-view', isLoggedIn, getById);
router.post('/api-sat/source/:id_fuente/edit', isLoggedIn, updateSource);


module.exports = router;