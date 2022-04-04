const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { zoneList, viewZone, createZone, getById, updateZone} = require('@controllers/front/zone.controllers');

// get zone list
router.get('/api-sat/zone-list', isLoggedIn, zoneList);

// zone create
router.get('/api-sat/zone/view-create', isLoggedIn, viewZone);
router.post('/api-sat/zone/create', isLoggedIn, createZone);

// zone edit
router.get('/api-sat/zona/:id_zona/edit-view', isLoggedIn, getById);
router.post('/api-sat/zona/:id_zona/edit', isLoggedIn, updateZone);


module.exports = router;