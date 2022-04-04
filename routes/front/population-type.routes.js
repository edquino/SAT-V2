const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { populationTypeList, viewPopulationType, createPopultationType, getById, updatePopulationType } = require('@controllers/front/population-type.controllers');

router.get('/api-sat/population-type-list', isLoggedIn, populationTypeList);

router.get('/api-sat/population-type/create-view', isLoggedIn, viewPopulationType);
router.post('/api-sat/population-type/create', isLoggedIn, createPopultationType);

router.get('/api-sat/population-type/:id_poblacion/update-view', isLoggedIn, getById);
router.post('/api-sat/population-type/:id_poblacion/update', isLoggedIn, updatePopulationType);


module.exports = router;