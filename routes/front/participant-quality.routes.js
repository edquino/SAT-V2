const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { participantQualityList, viewParticipantQuality, createParticipantQuality, getById, updateParticipantQuality } = require('@controllers/front/participant-quality.controllers');

router.get('/api-sat/participant-quality-list', isLoggedIn, participantQualityList);

router.get('/api-sat/participant-quality/create-view', isLoggedIn, viewParticipantQuality);
router.post('/api-sat/participant-quality/create', isLoggedIn, createParticipantQuality);

router.get('/api-sat/participant-quality/:id_calidad_participa/update-view', isLoggedIn, getById);
router.post('/api-sat/participant-quality/:id_calidad_participa/update', isLoggedIn, updateParticipantQuality);


module.exports = router;