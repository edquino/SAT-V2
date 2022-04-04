const { Router } = require('express');
const router = Router();


const { isLoggedIn } = require('@middlewares/auth');
const { fontsTypeList, viewCreateTypeFont, createTypeFont, getById, updateFontType } = require('@controllers/front/source-type.controllers');

router.get('/api-sat/source-type-list', isLoggedIn, fontsTypeList);

router.get('/api-sat/source-type/create-view', isLoggedIn, viewCreateTypeFont);
router.post('/api-sat/source-type/create', isLoggedIn, createTypeFont);

router.get('/api-sat/source-type/:id_tipo_fuente/edit-view', isLoggedIn, getById);
router.post('/api-sat/source-type/:id_tipo_fuente/edit', updateFontType);


module.exports = router;