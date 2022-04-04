const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let conflictSituationList = async(req, res) => {

    try {
        await db.query(`SELECT id_situacion_conflicto, nombre_conflicto, ponderacion, estado
        FROM sat_situacion_actual_conflicto ORDER BY id_situacion_conflicto ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'conflict-situation', 'conflictSituationList', err, false, req, res);
            }else{
                var conflictSituation = results.rows;
                return res.render('conflict-situation/conflict_situation_list', { conflictSituation });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'conflictSituationList', error, false, req, res);
    }
};

let viewCreateConflictSituation = async(req, res)=>{
    return res.render('conflict-situation/conflict_situation_create');
};

let createConflictSituation = async (req, res) => {
    const { nombre_conflicto, ponderacion, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    if(isNaN(ponderacion)){
        req.flash('warning', 'El dato ponderación es invalido');
        return res.redirect('/api-sat/aggression/create-view');
    }

    try {
        await db.query(`INSERT INTO sat_situacion_actual_conflicto(
            nombre_conflicto, ponderacion, cod_usu_ing, cod_usu_mod, estado)
            VALUES ( $1, $2, $3, $4, $5)`, [nombre_conflicto, ponderacion, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'conflict-situation', 'createAggressionType', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/conflict-situation-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'createAggressionType', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_situacion_conflicto } = req.params;
    try {
        await db.query(`SELECT id_situacion_conflicto, nombre_conflicto, ponderacion, estado
        FROM sat_situacion_actual_conflicto WHERE id_situacion_conflicto = $1`,[id_situacion_conflicto], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'conflict-situation', 'getById', err, false, req, res);
            }else{
                var conflictSituation = results.rows[0];
                return res.render('conflict-situation/conflict_situation_edit', { conflictSituation });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'getById', error, false, req, res);
    }
};

let updateConflictSituation = async (req, res)=>{
    
    const { id_situacion_conflicto } = req.params;
    const { nombre_conflicto, ponderacion, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_situacion_actual_conflicto
        SET nombre_conflicto=$1, ponderacion=$2, fecha_mod_reg=$3, cod_usu_ing=$4, cod_usu_mod=$5, estado=$6
        WHERE id_situacion_conflicto=$7`, [nombre_conflicto, ponderacion, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_situacion_conflicto], (err, results)=>{
            if(err){
                log('src/controllers/front', 'conflict-situation', 'updateConflictSituation', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/conflict-situation-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'updateConflictSituation', error, false, req, res);
    }

};

module.exports = {
    conflictSituationList,
    viewCreateConflictSituation,
    createConflictSituation,
    getById,
    updateConflictSituation
}
