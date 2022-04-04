const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');


let conflictPhasesList = async(req, res) => {
    try {
        await db.query(`SELECT id_fase_conflicto, nombre_fase, estado
        FROM sat_fase_conflicto ORDER BY id_fase_conflicto ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'conflict-phases', 'conflictPhasesList', err, false, req, res);
            }else{
                var conflictPhases = results.rows;
                return res.render('conflict-phases/conflict_phases_list', { conflictPhases });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'conflict-phases', 'conflictPhasesList', err, false, req, res);
    }
};


let viewCreateConflictPhase = async(req, res)=>{
    return res.render('conflict-phases/conflict_pahese_create');
};


let createConflictPhase = async (req, res) => {
    const { nombre_fase, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_fase_conflicto(
            nombre_fase, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4) RETURNING *`, [nombre_fase, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'conflict-phases', 'createConflictPhase', err, false, req, res);
            } else {
                req.flash('success', 'Tipo de fuente creada correctamente');
                return res.redirect('/api-sat/conflict-phases-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'conflict-phases', 'createConflictPhase', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_fase_conflicto } = req.params;
    try {
        await db.query(`SELECT id_fase_conflicto, nombre_fase, estado
        FROM sat_fase_conflicto
        WHERE id_fase_conflicto = $1`,[id_fase_conflicto], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'conflict-phases', 'getById', err, false, req, res);
            }else{
                var conflictPhase = results.rows[0];
                return res.render('conflict-phases/conflict_pahese_edit', { conflictPhase });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'conflict-phases', 'getById', error, false, req, res);
    }
};

let updateConflictPhase = async (req, res)=>{
    
    const { id_fase_conflicto } = req.params;
    const { nombre_fase, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_fase_conflicto
        SET nombre_fase= $1, fecha_mod_reg = $2, cod_usu_ing=$3, cod_usu_mod=$4, estado=$5
        WHERE id_fase_conflicto=$6`, [nombre_fase, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_fase_conflicto], (err, results)=>{
            if(err){
                log('src/controllers/front', 'conflict-phases', 'updateConflictPhase', err, false, req, res);
             }else{
                req.flash('warning', 'Tipo de fuente actualizado correctamente');
                return res.redirect('/api-sat/conflict-phases-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'conflict-phases', 'updateConflictPhase', error, false, req, res);
    }

};

module.exports = {
    conflictPhasesList,
    viewCreateConflictPhase,
    createConflictPhase,
    getById,
    updateConflictPhase
}