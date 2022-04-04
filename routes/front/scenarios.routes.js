const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { scenariosList, viewScenarios, createScenarios, getById, updateScenarios } = require('@controllers/front/scenarios.controllers');


// get scenario list
router.get('/api-sat/scenarios-list', isLoggedIn, scenariosList);

// scenario create
router.get('/api-sat/scenarios/view-create', isLoggedIn, viewScenarios);
router.post('/api-sat/scenarios/create', isLoggedIn, createScenarios);

// scenario edit
router.get('/api-sat/scenarios/:id_escenario/edit-view', isLoggedIn, getById);
router.post('/api-sat/scenarios/:id_escenario/edit', isLoggedIn, updateScenarios);

module.exports = router;