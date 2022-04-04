const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { entryTypeList, viewEntryType, createEntryType, getById, updateEntryTpe} = require('../../controllers/front/entry-type.controllers');

// get zone list
router.get('/api-sat/entry-type-list', isLoggedIn, entryTypeList);

// zone create
router.get('/api-sat/entry-type/view-create', isLoggedIn, viewEntryType);
router.post('/api-sat/entry-type/create', isLoggedIn, createEntryType);

// zone edit
router.get('/api-sat/entry-type/:id_entrada/edit-view', isLoggedIn, getById);
router.post('/api-sat/entry-type/:id_entrada/edit', isLoggedIn, updateEntryTpe);


module.exports = router;