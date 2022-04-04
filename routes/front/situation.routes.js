const {Router} = require('express');
const router = Router();

const {isLoggedIn} = require('@middlewares/auth');
const {conflictSituationList, viewCreateConflictSituation, createConflictSituation, getById, updateConflictSituation} = require('@controllers/front/situation.controller');

router.get('/api-sat/situation-list', isLoggedIn, conflictSituationList);

router.get('/api-sat/situation/create-view', isLoggedIn, viewCreateConflictSituation);
router.post('/api-sat/situation/create', isLoggedIn, createConflictSituation);

router.get('/api-sat/situation/:id_situacion_conflictiva/update-view', isLoggedIn, getById);
router.post('/api-sat/situation/:id_situacion_conflictiva/update', isLoggedIn, updateConflictSituation);

module.exports = router;