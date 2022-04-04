const {Router} = require('express');
const router = Router();

const { isLoggedIn } = require('@middlewares/auth');
const { usersList, getById, usersAuthotization, updateUsersAuthotization, userProfile } = require('@controllers/front/users.controllers');

router.get('/api-sat/users-list', isLoggedIn, usersList);

router.get('/api-sat/users/:id_usuario/edit-view', isLoggedIn, getById);
router.post('/api-sat/user-authorization', isLoggedIn, usersAuthotization);

router.post('/api-sat/user-authorization/:id_usuario/update', isLoggedIn, updateUsersAuthotization);

router.get('/api-sat/user-profile', isLoggedIn, userProfile);


module.exports = router;