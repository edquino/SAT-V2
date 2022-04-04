const {Router} = require('express');
const router = Router();

const { usersTokenVerification } = require('@middlewares/token.middleware');
const { getCrisisAlertsForm, crisisAlertsList, getById, createCrisisAlert, updateCrisisAlert, getFormToAnalyze, analyzeCrisisAlert, searchCrisisAlert, getRelatedCases, removeRelatedCase, searchForRelatedCase, addRelatedCase, SendAlerttoAnalyze,getFormVersion, SendAtencionCrisisToSIGI } = require('@controllers/back/crisis-alert.controllers');

router.get('/api/crisis', usersTokenVerification,  crisisAlertsList);
router.post('/api/crisis', usersTokenVerification, createCrisisAlert);

router.get('/api/crisis/search', usersTokenVerification, searchCrisisAlert);
router.get('/api/crisis/:id_atencion_crisis', usersTokenVerification, getById);
router.put('/api/crisis/:id_atencion_crisis', usersTokenVerification, updateCrisisAlert);
router.get('/api/crisis/:id_atencion_crisis/related', usersTokenVerification, getRelatedCases);
router.put('/api/crisis/related/:id_padre/:id_hijo', usersTokenVerification, addRelatedCase);
router.delete('/api/crisis/related/:id_padre/:id_hijo', usersTokenVerification, removeRelatedCase);
router.get('/api/crisis/:id_padre/related/search', usersTokenVerification, searchForRelatedCase);

router.get('/api/forms/crisis/version',usersTokenVerification, getFormVersion);
router.get('/api/crisis/form/empty', usersTokenVerification, getCrisisAlertsForm);
router.get('/api/crisis/form/analyze/:id_atencion_crisis', usersTokenVerification, getFormToAnalyze);
router.put('/api/crisis/form/analyze/:id_atencion_crisis', usersTokenVerification, analyzeCrisisAlert);

router.put('/api/crisis/:id_atencion_crisis/sendToAnalyze',usersTokenVerification, SendAlerttoAnalyze);
router.put('/api/crisis/:id_atencion_crisis/send-to-sigi', usersTokenVerification, SendAtencionCrisisToSIGI); 



module.exports = router;

