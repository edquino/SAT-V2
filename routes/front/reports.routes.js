const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { reportIndicators, reportTypeAlert, reportPhasesConflict, reportConflictSituation, getHeatMap, getContextIndicators} = require('@controllers/front/reports.controllers');

// Get Report Indicators
router.get('/api-sat/report/indicators', isLoggedIn, reportIndicators);

// Get Report Type Alert 
router.get('/api-sat/report/type-alert', isLoggedIn, reportTypeAlert);

// Get Report Phases Conflic
router.get('/api-sat/report/phases-conflict', isLoggedIn, reportPhasesConflict);

//Get Report Conflict Situation
router.get('/api-sat/report/conflict-situation', isLoggedIn, reportConflictSituation);

// Get Heat Map 
router.get('/api-sat/report/heat-map', isLoggedIn, getHeatMap);

//Get context indicator
router.get('/api-sat/report/context-indicators', isLoggedIn, getContextIndicators)

module.exports = router;