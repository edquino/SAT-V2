const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let aggressionTypeList = async(req, res) => {

    try {
        await db.query(`SELECT id_tipo_agresion, nombre_agresion, ponderacion, estado
        FROM sat_tipo_agresion ORDER BY id_tipo_agresion ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'aggression-type', 'aggressionTypeList', err, false, req, res);
            }else{
                var aggressionType = results.rows;
                return res.render('aggression-type/aggression_type_list', { aggressionType });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'aggression-type', 'aggressionTypeList', error, false, req, res);
    }
};

let viewCreateAggressionType = async(req, res)=>{
    return res.render('aggression-type/aggresion_create');
};

let createAggressionType = async (req, res) => {
    const { nombre_agresion, ponderacion, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    if(isNaN(ponderacion)){
        req.flash('warning', 'El dato ponderación es invalido');
        return res.redirect('/api-sat/aggression/create-view');
    }

    try {
        await db.query(`INSERT INTO sat_tipo_agresion(
            nombre_agresion, ponderacion, cod_usu_ing, cod_usu_mod, estado)
            VALUES ( $1, $2, $3, $4, $5)`, [nombre_agresion, ponderacion, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'aggression-type', 'createAggressionType', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/aggression-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'aggression-type', 'createAggressionType', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_tipo_agresion } = req.params;
    try {
        await db.query(`SELECT id_tipo_agresion, nombre_agresion, ponderacion, estado
        FROM sat_tipo_agresion WHERE id_tipo_agresion = $1`,[id_tipo_agresion], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'actions-pddh', 'getById', err, false, req, res);
            }else{
                var aggresionType = results.rows[0];
                return res.render('aggression-type/aggression_type_edit', { aggresionType });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'actions-pddh', 'getById', error, false, req, res);
    }
};

let updateAggressionType = async (req, res)=>{
    
    const { id_tipo_agresion } = req.params;
    const { nombre_agresion, ponderacion, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_tipo_agresion
        SET  nombre_agresion=$1, ponderacion=$2, fecha_mod_reg=$3, cod_usu_ing=$4, cod_usu_mod=$5, estado=$6
        WHERE id_tipo_agresion=$7`, [nombre_agresion, ponderacion, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_tipo_agresion], (err, results)=>{
            if(err){
                log('src/controllers/front', 'aggression-type', 'updateAggressionType', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/aggression-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'aggression-type', 'updateAggressionType', error, false, req, res);
    }

};

module.exports = {
    aggressionTypeList,
    viewCreateAggressionType,
    createAggressionType,
    getById,
    updateAggressionType
}
