const {Router} = require('express');
const router = Router();

const multer = require("multer");
const path = require("path");

const { isLoggedIn } = require('@middlewares/auth');
const { earlyAlertsList, viewCreateAlert, createAlert, viewUpdateAlert, updateAlert, viewAnalizeAlert, SendAlerttoAnalyze, AnalizeAlert, viewRealteAlert, realteAlert, removeRelateedAlert, viewAlert, searchMunicipalityBySatate, getSubtopicsByTopic, getConflictSituationBySubtopic, getCriterioByConflictSituation, getSourceByTypeSource} = require('../../controllers/front/early-alert.controllers');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/uploads"))
    },
    filename: function (req, file, cb) {
        fileExtension = file.originalname.split(".")[1]
        cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension)
    },
});

var upload = multer({ storage: storage });

router.get('/api-sat/early-alert/list', isLoggedIn, earlyAlertsList);

//Create Alert 
router.get('/api-sat/early-alert/view-create', isLoggedIn, viewCreateAlert);
router.post('/api-sat/early-alert/create', isLoggedIn, upload.array("file", 2), createAlert);

//Update Alert
router.get('/api-sat/early-alert/:id_alerta_temprana/view-update', isLoggedIn, viewUpdateAlert);
router.post('/api-sat/early-alert/:id_alerta_temprana/update', isLoggedIn, upload.array("file", 2), updateAlert);

//Send Alerta to Analize
router.get('/api-sat/early-alert/:id_alerta_temprana/sen-to-analize', isLoggedIn, SendAlerttoAnalyze)

//Ananlize Alert
router.get('/api-sat/early-alert/:id_alerta_temprana/view-analize', isLoggedIn, viewAnalizeAlert);
router.post('/api-sat/early-alert/:id_alerta_temprana/analize', isLoggedIn, AnalizeAlert);

//Realte Alert
router.get('/api-sat/early-alert/:id_alerta_temprana/view-relate-alert', isLoggedIn, viewRealteAlert);
router.post('/api-sat/early-alert/:id_alerta_principal/relate-alert/:id_alerta_temprana', isLoggedIn, realteAlert);

//Remove Related Alert
router.post('/api-sat/early-alert/:id_alerta_temprana/related-alert/:id_alerta_relacionada/remove-related-alert', isLoggedIn, removeRelateedAlert)

//View Alert
router.get('/api-sat/early-alert/:id_alerta_temprana/view-alert', isLoggedIn, viewAlert);

//View Alerte from view analized
router.get('/api-sat/early-alert/:id_padre/view-alert', isLoggedIn, viewAlert);

//get municipalities by state
router.get('/api-sat/municipality/:id_departamento/list', isLoggedIn, searchMunicipalityBySatate);

//get Subtopic by Topic
router.get('/api-sat/subtopic/:id_tematica_relacionada/list', isLoggedIn, getSubtopicsByTopic);

//get Situation Conflict By Subtopic
router.get('/api-sat/situacion_conflictiva/:id_subtematica/list', isLoggedIn, getConflictSituationBySubtopic);

//get Criterio By Situation Conflict
router.get('/api-sat/criterio/:id_situacion_conflictiva/list', isLoggedIn, getCriterioByConflictSituation);

//get Source By Type Source
router.get('/api-sat/source/:id_tipo_fuente/list', isLoggedIn, getSourceByTypeSource)


module.exports = router;