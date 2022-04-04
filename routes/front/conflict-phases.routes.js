const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { conflictPhasesList, viewCreateConflictPhase, createConflictPhase, getById, updateConflictPhase } = require('@controllers/front/conflict-phases.controllers');

router.get('/api-sat/conflict-phases-list', isLoggedIn, conflictPhasesList);

router.get('/api-sat/conflict-phases/create-view', viewCreateConflictPhase);
router.post('/api-sat/conflict-phases/create', createConflictPhase);

router.get('/api-sat/conflict-phases/:id_fase_conflicto/update-view', getById);
router.post('/api-sat/conflict-phases/:id_fase_conflicto/update', updateConflictPhase);

module.exports = router;