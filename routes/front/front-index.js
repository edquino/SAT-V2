module.exports = (app, passport) => {

    //authentication
    require('./auth-user')(app, passport);

    //Home 
    app.use(require('./index'));

    //Fonts Type
    app.use(require('./source-type.routes'));

    //Alerts Type
    app.use(require('./alerts-type.routes'));

    //Source
    app.use(require('./source.routes'));

    //Scenario
    app.use(require('./scenario.routes'));   
    
    //Scenarios
    app.use(require('./scenarios.routes'));

    //Phases Conflict
    app.use(require('./conflict-phases.routes'));

    // Actions PDDH
    app.use(require('./actions-pddh.routes'));

    //Agression Type
    app.use(require('./aggression-type.routes'));

    //Conflict Situation
    app.use(require('./conflict-situation.routes'));

    //Modules
    app.use(require('./modules.routes'));

    //Users 
    app.use(require('./users.router'));

    //Roles 
    app.use(require('./roles.routes'));
    
    //Administrative Units
    app.use(require('./administrative-units.routes'));

    //Zonas
    app.use(require('./zone.routes'));

    //Entry Type
    app.use(require('./entry-type.routes'));

    //sex
    app.use(require('./sex.routes'));

    //Gender
    app.use(require('./gender.routes'));

    //Population Type
    app.use(require('./population-type.routes'));

    //Crisis Classification Quality 
    app.use(require('./crisis-classification-quality.routes'));

    //Participant Quality
    app.use(require('./participant-quality.routes'));

    //Banner
    app.use(require('./banner.routes'));

    //Issuance Reference
    app.use(require('./issuance-reference.routes'));

    //Temporality
    app.use(require('./temporality.routes'));

    //Topic
    app.use(require('./topic.routes'));

    //Subtopic
    app.use(require('./subtopic.routes'));

    //Situation
    app.use(require('./situation.routes'));

    //Criterion
    app.use(require('./criterion.routes'));

    //Heat-Map
    app.use(require('./reports.routes'));

    app.use(require('./early-alert.routes'));

};