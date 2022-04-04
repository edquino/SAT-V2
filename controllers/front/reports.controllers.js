const db = require('@config/db');
const log = require('@lib/catch-error');


let reportIndicators = async(req, res) =>{
    try {
        return res.render('reports/indicators');   
    } catch (error) {
        log('src/controllers/front', 'reports', 'indicators', error, false, req, res);
    }
};

let reportTypeAlert = async(req, res) =>{
    try {
        return res.render('reports/alert_type');   
    } catch (error) {
        log('src/controllers/front', 'reports', 'reportTypeAlert', error, false, req, res);
    }
};

let reportPhasesConflict = async(req, res) =>{
    try {
        return res.render('reports/phases _conflict');   
    } catch (error) {
        log('src/controllers/front', 'reports', 'reportTypeAlert', error, false, req, res);
    }
};

let reportConflictSituation = async(req, res) =>{
    try {
        return res.render('reports/conflict_situation');   
    } catch (error) {
        log('src/controllers/front', 'reports', 'reportTypeAlert', error, false, req, res);
    }
};


let getHeatMap = async(req, res) =>{
    try {
        return res.render('reports/heat_map');   
    } catch (error) {
        log('src/controllers/front', 'reports', 'getHeatMap', error, false, req, res);
    }
};

let getContextIndicators = async(req, res) =>{
    try {
        return res.render('reports/context_indicators');   
    } catch (error) {
        log('src/controllers/front', 'reports', 'getHeatMap', error, false, req, res);
    }
};

module.exports = {
    reportIndicators,
    reportTypeAlert,
    reportPhasesConflict,
    reportConflictSituation,
    getHeatMap,
    getContextIndicators
}