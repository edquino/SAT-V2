const db = require('@config/db');
const log = require('@lib/catch-error');

let viewIndex = async(req, res) => {
    
    try {
        
        let alertsTotal = await db.query(`SELECT COUNT(id_alerta_temprana) AS total_alertas 
        FROM sat_alerta_temprana`);
        alertsTotal = alertsTotal.rows[0].total_alertas;

        let totalCrisisAtention = await db.query(`SELECT COUNT(id_atencion_crisis) AS total_atencion_crisis 
        FROM sat_atencion_crisis`);
        totalCrisisAtention = totalCrisisAtention.rows[0].total_atencion_crisis;

        let expedients = await db.query(`SELECT COUNT(id_est_expediente) AS expedientes
        FROM sat_est_expedientes`);
        expedients = expedients.rows[0].expedientes;

        let imminentActions = await db.query(`SELECT COUNT(id_est_acciones) AS acciones_inminentes
        FROM sat_est_acciones_inm`);
        imminentActions = imminentActions.rows[0].acciones_inminentes;

        let usuarios = await db.query(`SELECT COUNT(id_usuario) AS usuarios
        FROM usuario`);
        usuarios = usuarios.rows[0].usuarios;

        let unit_administrative = await db.query(`SELECT COUNT(id_unidad_administrativa) AS unidad_admin
        FROM sat_unidad_administrativa`);
        unit_administrative = unit_administrative.rows[0].unidad_admin;
    

        var year = new Date().getFullYear();
        return res.render('home/home',{user: req.user, year, alertsTotal, totalCrisisAtention, expedients, imminentActions, usuarios, unit_administrative});

    } catch (error) {
        log('src/controllers/front', 'index', 'viewIndex', error, false, req, res);
    }

};

module.exports = {
    viewIndex
}