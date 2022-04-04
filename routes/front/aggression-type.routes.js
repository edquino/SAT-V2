const {Router} = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { aggressionTypeList, viewCreateAggressionType, createAggressionType, getById, updateAggressionType} = require('@controllers/front/aggression-type.controllers');

// get list actions PDDH
router.get('/api-sat/aggression-list', isLoggedIn, aggressionTypeList);

router.get('/api-sat/aggression/create-view', isLoggedIn, viewCreateAggressionType);
router.post('/api-sat/aggression/create', isLoggedIn, createAggressionType);

router.get('/api-sat/aggression/:id_tipo_agresion/update-view', isLoggedIn, getById);
router.post('/api-sat/aggression/:id_tipo_agresion/update', isLoggedIn, updateAggressionType);

module.exports = router;