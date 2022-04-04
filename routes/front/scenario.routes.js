const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { scenarioList, viewScenario, createScenario, getById, updateScenario } = require('@controllers/front/scenario.controllers');


// get scenario list
router.get('/api-sat/scenario-list', isLoggedIn, scenarioList);

// scenario create
router.get('/api-sat/scenario/view-create', isLoggedIn, viewScenario);
router.post('/api-sat/scenario/create', isLoggedIn, createScenario);

// scenario edit
router.get('/api-sat/scenario/:id_escenario/edit-view', isLoggedIn, getById);
router.post('/api-sat/scenario/:id_escenario/edit', isLoggedIn, updateScenario);

module.exports = router;