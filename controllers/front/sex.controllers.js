const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let sexList = async(req, res) => {
    
    try {
        await db.query('SELECT id_sexo, nombre_sexo, estado FROM sat_sexo ORDER BY id_sexo ASC', (err, results)=>{
            if(err){
                log('src/controllers/front', 'sex', 'sexList', err, false, req, res);
            }else{
                var sexList = results.rows;
                return res.render('sex/sex_list', { sexList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'sex', 'sexList', error, false, req, res);
    }
};

let viewSex = async(req, res)=>{
    return res.render('sex/sex_create');
};

let createSex = async (req, res) => {
    const { nombre_sexo, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_sexo (
            nombre_sexo, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_sexo, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'sex', 'createSex', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/sex-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'sex', 'createSex', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_sexo } = req.params;
    try {
        await db.query('SELECT id_sexo, nombre_sexo, estado FROM sat_sexo WHERE id_sexo = $1',[id_sexo], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'sex', 'getById', err, false, req, res);
            }else{
                var sex = results.rows[0];
                return res.render('sex/sex_edit', { sex });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'sex', 'getById', error, false, req, res);
    }
};

let updateSex = async (req, res)=>{
    
    const { id_sexo } = req.params;
    const { nombre_sexo, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`UPDATE sat_sexo
        SET nombre_sexo = $1, fecha_mod_reg = $2, estado = $3, cod_usu_ing = $4, cod_usu_mod = $5
        WHERE id_sexo = $6`, [nombre_sexo, fecha_mod_reg, estado, cod_usu_ing, cod_usu_mod, id_sexo], (err, results)=>{
            if(err){
                log('src/controllers/front', 'sex', 'updateSex', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/sex-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'sex', 'updateSex', error, false, req, res);
    }

};

module.exports = {
    sexList,
    viewSex,
    createSex,
    getById,
    updateSex
}