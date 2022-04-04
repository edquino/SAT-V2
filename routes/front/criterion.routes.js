const {Router} = require('express');
const router = Router();

const {isLoggedIn} = require('@middlewares/auth');
const {criterionList, viewCreateCriterion, createCriterion, getById, updateCriterion, getSubtopicsByTopic, getConflictSituationBySubtopic} = require('@controllers/front/criterion.controllers');

router.get('/api-sat/criterion-list', isLoggedIn, criterionList);

router.get('/api-sat/criterion/create-view', isLoggedIn, viewCreateCriterion);
router.post('/api-sat/criterion/create', isLoggedIn, createCriterion);

router.get('/api-sat/criterion/:id_criterio/update-view', isLoggedIn, getById);
router.post('/api-sat/criterion/:id_criterio/update', isLoggedIn, updateCriterion);

//Get List Sub-topic by id_tema 
router.get('/api-sat/topic/subtopic/:id_tema/list', isLoggedIn, getSubtopicsByTopic);

//Get List Conflict-Situation by id_subtema 
router.get('/api-sat/subtopic/situation/:id_subtema/list', isLoggedIn, getConflictSituationBySubtopic);

module.exports = router;