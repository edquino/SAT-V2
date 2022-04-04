const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let alertTypeList = async(req, res) => {
    try {
        await db.query('SELECT id_tipo_alerta, nombre_alerta, estado FROM sat_tipo_alerta', (err, results)=>{
            if(err){
                log('src/controllers/front', 'alerts-type', 'alertTypeList', err, false, req, res);
            }else{
                var alertTypeList = results.rows;
                return res.render('alerts-type/alerts_types_list', { alertTypeList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'alerts-type', 'alertTypeList', err, false, req, res);
    }
};


let viewCreateAlertType = async(req, res)=>{
    return res.render('alerts-type/alerts_type_create');
};


let createAlertType = async (req, res) => {
    const { nombre_alerta, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_tipo_alerta(
            nombre_alerta, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4) RETURNING *`, [nombre_alerta, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'alerts_type', 'createAlertType', err, false, req, res);
            } else {
                req.flash('success', 'Alerta creada correctamente');
                return res.redirect('/api-sat/alert-type-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'alerts_type', 'createAlertType', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_tipo_alerta } = req.params;
    try {
        await db.query('SELECT id_tipo_alerta, nombre_alerta, estado FROM sat_tipo_alerta WHERE id_tipo_alerta = $1',[id_tipo_alerta], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'alerts_type', 'getById', err, false, req, res);
            }else{
                var alertType = results.rows[0];
                return res.render('alerts-type/alerts_type_update', { alertType });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'alerts_type', 'getById', error, false, req, res);
    }
};

let updateAlertType = async (req, res)=>{
    
    const { id_tipo_alerta } = req.params;
    const { nombre_alerta, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_tipo_alerta
        SET nombre_alerta = $1, fecha_mod_reg = $2, cod_usu_ing=$3, cod_usu_mod=$4, estado = $5
        WHERE id_tipo_alerta = $6`, [nombre_alerta, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_tipo_alerta], (err, results)=>{
            if(err){
               log('src/controllers/front', 'alerts-type', 'updateAlertType', err, false, req, res);
            }else{
                req.flash('warning', 'Alerta actualizado correctamente');
                return res.redirect('/api-sat/alert-type-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'alert-type', 'updateAlertType', error, false, req, res);
    }

};



module.exports = {
    alertTypeList,
    viewCreateAlertType,
    createAlertType,
    getById,
    updateAlertType
    
}