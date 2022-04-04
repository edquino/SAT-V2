const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { administrativeUnitsList, viewCreateAdministrativeUnit, createAdministrativeUnit, getById, updateAdministrativeUnit, viewSendNotification, sendNotification} = require('@controllers/front/administrative-units.controllers');

// get source list
router.get('/api-sat/administrative-units-list', isLoggedIn, administrativeUnitsList);

router.get('/api-sat/administrative-units/create-view', isLoggedIn, viewCreateAdministrativeUnit);
router.post('/api-sat/administrative-units/create', isLoggedIn, createAdministrativeUnit)

router.get('/api-sat/administrative-units/:id_unidad_administrativa/view-update', isLoggedIn, getById)
router.post('/api-sat/administrative-units/:id_unidad_administrativa/update', isLoggedIn, updateAdministrativeUnit)

router.get('/api-sat/administrative-units/notify', isLoggedIn, viewSendNotification);
router.post('/api-sat/administrative-units/notify',isLoggedIn,sendNotification);

module.exports = router;

