const { Router } = require('express');
const router = Router();

const {isLoggedIn} = require('@middlewares/auth');
const { issuanceReferenceList, viewCreateIssuanceReference, createIssuanceReference, getById, updateIssuanceReference} = require('@controllers/front/issuance-reference.controllers');


// get list actions PDDH
router.get('/api-sat/issuance-reference-list', isLoggedIn, issuanceReferenceList);

router.get('/api-sat/issuance-reference/create-view', isLoggedIn, viewCreateIssuanceReference);
router.post('/api-sat/issuance-reference/create', isLoggedIn, createIssuanceReference);

router.get('/api-sat/issuance-reference/:id_referencia_emision/update-view', isLoggedIn, getById);
router.post('/api-sat/issuance-reference/:id_referencia_emision/update', isLoggedIn, updateIssuanceReference);

module.exports = router;