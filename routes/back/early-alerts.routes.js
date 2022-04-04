const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { earlyAlertsList, getById, getEarlyAlertForm, createEarlyAlert, updateEarlyAlert, getFormToAnalyze, analyzeEarlyAlert, searchEarlyAlert,  getRelatedCases, removeRelatedCase, searchForRelatedCase, addRelatedCase, SendAlerttoAnalyze, getFormVersion} = require('@controllers/back/early-alert.controllers');

router.post('/api/alerts', usersTokenVerification, createEarlyAlert);
router.get('/api/alerts', usersTokenVerification, earlyAlertsList);

router.get('/api/alerts/search', usersTokenVerification, searchEarlyAlert);
router.get('/api/alerts/:id_alerta_temprana', usersTokenVerification, getById);
router.put('/api/alerts/:id_alerta_temprana', usersTokenVerification, updateEarlyAlert);

router.get('/api/alerts/:id_alerta_temprana/related', usersTokenVerification, getRelatedCases);
router.put('/api/alerts/related/:id_padre/:id_hijo', usersTokenVerification, addRelatedCase);
router.delete('/api/alerts/related/:id_padre/:id_hijo', usersTokenVerification, removeRelatedCase);
router.get('/api/alerts/:id_padre/related/search', usersTokenVerification, searchForRelatedCase);


router.get('/api/forms/alerts/version',usersTokenVerification, getFormVersion);
router.get('/api/alerts/form/empty',usersTokenVerification, getEarlyAlertForm);
router.get('/api/alerts/form/analyze/:id_alerta_temprana',usersTokenVerification, getFormToAnalyze);
router.put('/api/alerts/form/analyze/:id_alerta_temprana',usersTokenVerification, analyzeEarlyAlert);

router.put('/api/alerts/:id_alerta_temprana/sendToAnalyze',usersTokenVerification, SendAlerttoAnalyze)




module.exports = router;