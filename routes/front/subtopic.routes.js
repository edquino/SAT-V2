const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const {subtopicList, viewCreateSubtopic, createSubtopic, getById, updateSubtopic} = require('@controllers/front/subtopic.controllers');

router.get('/api-sat/subtopic-list', isLoggedIn, subtopicList);

router.get('/api-sat/subtopic/create-view', isLoggedIn, viewCreateSubtopic);
router.post('/api-sat/subtopic/create', isLoggedIn, createSubtopic);

router.get('/api-sat/subtopic/:id_subtema/update-view', isLoggedIn, getById);
router.post('/api-sat/subtopic/:id_subtema/update', isLoggedIn, updateSubtopic);

module.exports = router;