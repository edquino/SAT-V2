const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let actionsPDDHList = async(req, res) => {
    try {
        await db.query(`SELECT id_accion_pddh, nombre_accion, estado FROM sat_accion_pddh 
        ORDER BY id_accion_pddh ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'actions-pddh', 'actionsPDDHList', err, false, req, res);
            }else{
                var actionsPDDH = results.rows;
                return res.render('actions-pddh/actions_pddh_list', { actionsPDDH });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'actions-pddh', 'actionsPDDHList', err, false, req, res);
    }
};

let viewCreateActionPDHH = async(req, res)=>{
    return res.render('actions-pddh/actions_pdhh_create');
};

let createActionPDHH = async (req, res) => {
    const { nombre_accion, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_accion_pddh(
            nombre_accion, cod_usu_ing, cod_usu_mod, estado)
            VALUES ( $1, $2, $3, $4)`, [nombre_accion, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'actions-pddh', 'createConflictPhase', err, false, req, res);
            } else {
                req.flash('success', 'Accion PDDH creada correctamente');
                return res.redirect('/api-sat/actions-pddh-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'actions-pddh', 'createConflictPhase', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_accion_pddh } = req.params;

    try {
        await db.query(`SELECT id_accion_pddh, nombre_accion, estado FROM sat_accion_pddh
        WHERE id_accion_pddh = $1`,[id_accion_pddh], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'actions-pddh', 'getById', err, false, req, res);
            }else{
                var actionPDDH = results.rows[0];

                return res.render('actions-pddh/actions_pddh_edit', { actionPDDH });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'actions-pddh', 'getById', error, false, req, res);
    }
};

let updateActionPDDH = async (req, res)=>{
    
    const { id_accion_pddh } = req.params;
    const { nombre_accion, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_accion_pddh
        SET nombre_accion=$1, fecha_mod_reg=$2, cod_usu_ing=$3, cod_usu_mod=$4, estado=$5
        WHERE id_accion_pddh = $6`, [nombre_accion, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_accion_pddh], (err, results)=>{
            if(err){
                log('src/controllers/front', 'actions-pddh', 'updateActionPDDH', err, false, req, res);
             }else{
                req.flash('warning', 'Tipo de fuente actualizado correctamente');
                return res.redirect('/api-sat/actions-pddh-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'actions-pddh', 'updateActionPDDH', error, false, req, res);
    }

};


module.exports = {
    actionsPDDHList,
    viewCreateActionPDHH,
    getById,
    createActionPDHH,
    updateActionPDDH    
}