const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { genderList, viewCreateGender, createGender, getById, updateGender } = require('@controllers/front/gender.controllers');

// get gender list
router.get('/api-sat/gender-list', isLoggedIn, genderList);

// gender create
router.get('/api-sat/gender/view-create', isLoggedIn, viewCreateGender);
router.post('/api-sat/gender/create', isLoggedIn, createGender);

// gender edit
router.get('/api-sat/gender/:id_genero/edit-view', isLoggedIn, getById);
router.post('/api-sat/gender/:id_genero/edit', isLoggedIn, updateGender);


module.exports = router;