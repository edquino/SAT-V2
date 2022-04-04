const { Router } = require('express');
const router = Router();

const {isLoggedIn} = require('@middlewares/auth');
const { actionsPDDHList, viewCreateActionPDHH, createActionPDHH, getById, updateActionPDDH} = require('@controllers/front/actions-pddh.controllers');


// get list actions PDDH
router.get('/api-sat/actions-pddh-list', isLoggedIn, actionsPDDHList);

router.get('/api-sat/actions-pddh/create-view', isLoggedIn, viewCreateActionPDHH);
router.post('/api-sat/actions-pddh/create', isLoggedIn, createActionPDHH);

router.get('/api-sat/actions-pddh/:id_accion_pddh/update-view', isLoggedIn, getById);
router.post('/api-sat/actions-pddh/:id_accion_pddh/update', isLoggedIn, updateActionPDDH);

module.exports = router;