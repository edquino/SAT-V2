const db = require('@config/db');
const { isNotLoggedIn, isLoggedIn } = require('@middlewares/auth');


module.exports = function (app, passport) {

    // view-authenticate
    app.get('/Authenticate-SAT', isNotLoggedIn, async (req, res) => {
        res.render('auth-user/login');
    });

    //Authenticate
    app.post('/Authenticate-SAT', isNotLoggedIn, passport.authenticate('login-user', {
        successRedirect: '/',
        failureRedirect: '/Authenticate-SAT',
        failureFlash: true
    }));


    //session close 
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/Authenticate-SAT');
    });

};