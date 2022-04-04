module.exports = (app) => {

    //Auth routes
    app.use(require('./users.auth.routes'));
 
    //Early Alerts
    app.use(require('./early-alerts.routes'));

    //Crisis Alerts
    app.use(require('./crisis-alert.routes'));

    //Banner
    app.use(require('./banner.routes'));

    //upload
    app.use(require('./upload'));

    //Case Processing
    app.use(require('./case-processing.routes'));

};