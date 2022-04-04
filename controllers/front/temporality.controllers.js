const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let temporalityList = async(req, res) => {

    try {
        await db.query(`SELECT id_temporalidad, nombre_temporalidad, estado
        FROM sat_temporalidad ORDER BY id_temporalidad ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'temporality', 'temporalityList', err, false, req, res);
            }else{
                var temporalityList = results.rows;
                return res.render('temporality/temporality_list', { temporalityList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'temporality', 'temporalityList', error, false, req, res);
    }
};

let viewCreateTemporality = async(req, res)=>{
    return res.render('temporality/temporality_create');
};

let createTemporality = async (req, res) => {
    const { nombre_temporalidad, estado } = req.body;
    
    var cod_usu = req.user.id_usuario;
   
    try {
        await db.query(`INSERT INTO sat_temporalidad(
            nombre_temporalidad, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_temporalidad, cod_usu, cod_usu, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'temporality', 'createTemporality', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/temporality-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'temporality', 'createTemporality', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_temporalidad } = req.params;
    try {
        await db.query(`SELECT id_temporalidad, nombre_temporalidad, estado
        FROM sat_temporalidad WHERE id_temporalidad = $1`,[id_temporalidad], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'temporality', 'getById', err, false, req, res);
            }else{
                var temporality = results.rows[0];
                return res.render('temporality/temporality_edit', { temporality });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'temporality', 'getById', error, false, req, res);
    }
};

let updateTemporality = async (req, res)=>{
    
    const { id_temporalidad } = req.params;
    const { nombre_temporalidad, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_temporalidad
        SET nombre_temporalidad=$1, fecha_mod_reg=$2, cod_usu_ing=$3, cod_usu_mod=$4, estado=$5
        WHERE id_temporalidad=$6`, [nombre_temporalidad, fecha_mod_reg, cod_usu, cod_usu, estado, id_temporalidad], (err, results)=>{
            if(err){
                log('src/controllers/front', 'temporality', 'updateTemporality', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/temporality-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'temporality', 'updateTemporality', error, false, req, res);
    }

};

module.exports = {
    temporalityList,
    viewCreateTemporality, 
    createTemporality,
    getById,
    updateTemporality
}
