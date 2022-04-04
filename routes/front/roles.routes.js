const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { rolesList, viewCreateRole, createRole, getById, updateRole } = require('@controllers/front/roles.controllers');

router.get('/api-sat/role-list', isLoggedIn, rolesList);

router.get('/api-sat/roles/view-create', isLoggedIn, viewCreateRole);
router.post('/api-sat/roles/create', isLoggedIn, createRole);

router.get('/api-sat/roles/:id_rol_permisos/view-update', isLoggedIn, getById);
router.post('/api-sat/roles/:id_rol_permisos/update', isLoggedIn, updateRole);

module.exports = router;