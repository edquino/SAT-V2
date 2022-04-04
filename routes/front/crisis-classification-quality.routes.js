const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { classificationQualityList, viewclassificationQuality, createClassificationQuality, getById, updateClassificationQuality } = require('@controllers/front/crisis-classification-quality.controllers');

router.get('/api-sat/crisis-classification-quality-list', isLoggedIn, classificationQualityList);

router.get('/api-sat/crisis-classification-quality/create-view', isLoggedIn, viewclassificationQuality);
router.post('/api-sat/crisis-classification-quality/create', isLoggedIn, createClassificationQuality);

router.get('/api-sat/crisis-classification-quality/:id_calidad_crisis/update-view', isLoggedIn, getById);
router.post('/api-sat/crisis-classification-quality/:id_calidad_crisis/update', isLoggedIn, updateClassificationQuality);


module.exports = router;