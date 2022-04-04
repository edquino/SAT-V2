const {Router} = require('express');
const router = Router();

const {isLoggedIn} = require('@middlewares/auth');
const {conflictSituationList, viewCreateConflictSituation, createConflictSituation, getById, updateConflictSituation} = require('@controllers/front/conflict-situation.controller');

router.get('/api-sat/conflict-situation-list', isLoggedIn, conflictSituationList);

router.get('/api-sat/conflict-situation/create-view', isLoggedIn, viewCreateConflictSituation);
router.post('/api-sat/conflict-situation/create', isLoggedIn, createConflictSituation);

router.get('/api-sat/conflict-situation/:id_situacion_conflicto/update-view', isLoggedIn, getById);
router.post('/api-sat/conflict-situation/:id_situacion_conflicto/update', isLoggedIn, updateConflictSituation);

module.exports = router;