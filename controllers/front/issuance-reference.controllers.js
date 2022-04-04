const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let issuanceReferenceList = async(req, res) => {
    try {
        await db.query(`SELECT id_referencia_emision, nombre_referencia, estado
        FROM sat_referencia_emision ORDER BY id_referencia_emision ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'issuance-reference', 'issuanceReferenceList', err, false, req, res);
            }else{
                var issuanceReference = results.rows;
                return res.render('issuance-reference/issuance_reference_list', { issuanceReference });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'issuance-reference', 'issuanceReferenceList', err, false, req, res);
    }
};

let viewCreateIssuanceReference = async(req, res)=>{
    return res.render('issuance-reference/issuance_reference_create');
};

let createIssuanceReference = async (req, res) => {
    const { nombre_referencia, estado } = req.body;
    
    var cod_usu = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_referencia_emision(
            nombre_referencia, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_referencia, cod_usu, cod_usu, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'issuance-reference', 'createIssuanceReference', err, false, req, res);
            } else {
                req.flash('success', 'Accion PDDH creada correctamente');
                return res.redirect('/api-sat/issuance-reference-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'issuance-reference', 'createIssuanceReference', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_referencia_emision } = req.params;
    try {
        await db.query(`SELECT id_referencia_emision, nombre_referencia, estado
        FROM sat_referencia_emision WHERE id_referencia_emision = $1`,[id_referencia_emision], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'issuance-reference', 'getById', err, false, req, res);
            }else{
                var IssuanceReference = results.rows[0];
                return res.render('issuance-reference/issuance_reference_edit', { IssuanceReference });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'issuance-reference', 'getById', error, false, req, res);
    }
};

let updateIssuanceReference = async (req, res)=>{
    
    const { id_referencia_emision } = req.params;
    const { nombre_referencia, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_referencia_emision
        SET nombre_referencia=$1, fecha_mod_reg=$2, cod_usu_ing=$3, cod_usu_mod=$4, estado=$5
        WHERE id_referencia_emision=$6`, [nombre_referencia, fecha_mod_reg, cod_usu, cod_usu, estado, id_referencia_emision], (err, results)=>{
            if(err){
                log('src/controllers/front', 'issuance-reference', 'updateIssuanceReference', err, false, req, res);
             }else{
                req.flash('warning', 'Registo actualizado correctamente');
                return res.redirect('/api-sat/issuance-reference-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'issuance-reference', 'updateIssuanceReference', error, false, req, res);
    }

};


module.exports = {
    issuanceReferenceList,
    viewCreateIssuanceReference,
    getById,
    createIssuanceReference,
    updateIssuanceReference    
}