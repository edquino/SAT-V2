const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { topicList, viewCreateTopic, createTopic, getById, updateTopic } = require('@controllers/front/topic.controllers');

router.get('/api-sat/topic-list', isLoggedIn, topicList);

router.get('/api-sat/topic/view-create', isLoggedIn, viewCreateTopic);
router.post('/api-sat/topic/create', isLoggedIn, createTopic);

router.get('/api-sat/topic/:id_tema/view-update', isLoggedIn, getById);
router.post('/api-sat/topic/:id_tema/update', isLoggedIn, updateTopic);

module.exports = router;