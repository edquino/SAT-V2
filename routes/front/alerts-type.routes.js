const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { alertTypeList, viewCreateAlertType, createAlertType, getById, updateAlertType} = require('@controllers/front/alerts-type.controllers');

router.get('/api-sat/alert-type-list', isLoggedIn, alertTypeList);

router.get('/api-sat/alert-type/create-view', isLoggedIn, viewCreateAlertType);
router.post('/api-sat/alert-type/create', isLoggedIn, createAlertType);

router.get('/api-sat/alert-type/:id_tipo_alerta/update-view', isLoggedIn, getById);
router.post('/api-sat/alert-type/:id_tipo_alerta/update', isLoggedIn, updateAlertType);

module.exports = router;