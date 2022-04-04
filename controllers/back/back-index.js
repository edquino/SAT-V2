module.exports = (app) => {

    //Auth routes
    app.use(require('./users.auth.routes'));
 
    //Conflict Situation
    app.use(require('./conflict-situation.routes'));

    //Aggression Type
    app.use(require('./aggression-type.routes'));

    // Source Type
    app.use(require('./source-type.routes'));

    //Source
    app.use(require('./source.routes'));

    //Scenario
    app.use(require('./scenario.routes'));

    //Early Alerts
    app.use(require('./early-alerts.routes'));

    //Crisis Alerts
    app.use(require('./crisis-alert.routes'));

    //Vulnerable Groups
    app.use(require('./vulnerable-group.routes'));

    //Administrative Unit
    app.use(require('./administrative-units.routes'));

    //Entry Type
    app.use(require('./entry-type.routes'));

    // Countries
    app.use(require('./countries.routes'));

    //states
    app.use(require('./states.routes'));

    //municipality
    app.use(require('./municipality.routes'));

    //Zone
    app.use(require('./zone.routes'));

    // Sexual Orientation
    app.use(require('./sexual_orientation.routes'));

    // Sex
    app.use(require('./sex.routes'));

    //Gender
    app.use(require('./gender.routes'));

    //Population Type
    app.use(require('./population-type.routes'));

    //Crisis Classification Quality 
    app.use(require('./crisis-classification-quality.routes'));

    //Paticipant Quality
    app.use(require('./participant-quality.routes'));

    app.use(require('./banner.routes'));

};