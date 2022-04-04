const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { sexList, viewSex, createSex, getById, updateSex} = require('../../controllers/front/sex.controllers');

// get sex list
router.get('/api-sat/sex-list', isLoggedIn, sexList);

// sex create
router.get('/api-sat/sex/view-create', isLoggedIn, viewSex);
router.post('/api-sat/sex/create', isLoggedIn, createSex);

// sex edit
router.get('/api-sat/sex/:id_sexo/edit-view', isLoggedIn, getById);
router.post('/api-sat/sex/:id_sexo/edit', isLoggedIn, updateSex);


module.exports = router;