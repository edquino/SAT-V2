const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let modulesList = async(req, res) => {

    try {
        await db.query(`SELECT id_modulo, nombre_modulo, tipo_modulo, estado
        FROM sat_modulos ORDER BY tipo_modulo ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'modules', 'modulesList', err, false, req, res);
            }else{
                var modules = results.rows;
                return res.render('modules/modules_list', { modules });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'modules', 'modulesList', error, false, req, res);
    }
};

let viewCreateModule = async(req, res)=>{
    return res.render('modules/modules_create');
};

let createModule = async (req, res) => {
    const { nombre_modulo, tipo_modulo, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_modulos(
            nombre_modulo, tipo_modulo, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4, $5)`, [nombre_modulo, tipo_modulo, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'modules', 'createModule', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/modules-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'modules', 'createModule', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_modulo } = req.params;
    try {
        await db.query(`SELECT id_modulo, nombre_modulo, estado
        FROM sat_modulos WHERE id_modulo = $1`,[id_modulo], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'modules', 'getById', err, false, req, res);
            }else{
                var module = results.rows[0];
                return res.render('modules/modules_update', { module });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'modules', 'getById', error, false, req, res);
    }
};

let updateModule = async (req, res)=>{
    
    const { id_modulo } = req.params;
    const { nombre_modulo, tipo_modulo, estado } = req.body;
    
    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_modulos
        SET nombre_modulo=$1, tipo_modulo=$2, cod_usu_ing=$3, cod_usu_mod=$4, fecha_mod_reg=$5, estado=$6
        WHERE id_modulo=$7`, [nombre_modulo, tipo_modulo, cod_usu_ing, cod_usu_mod, fecha_mod_reg, estado, id_modulo], (err, results)=>{
            if(err){
                log('src/controllers/front', 'modules', 'updateModule', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/modules-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'modules', 'updateModule', error, false, req, res);
    }

};

module.exports = {
    modulesList,
    viewCreateModule,
    createModule,
    getById, 
    updateModule
}
