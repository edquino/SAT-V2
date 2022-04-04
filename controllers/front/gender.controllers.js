const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let genderList = async(req, res) => {
    
    try {
        await db.query('SELECT id_genero, nombre_genero, estado FROM sat_genero ORDER BY id_genero ASC', (err, results)=>{
            if(err){
                log('src/controllers/front', 'gender', 'genderList', err, false, req, res);
            }else{
                var genderList = results.rows;
                return res.render('gender/gender_list', { genderList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'gender', 'genderList', error, false, req, res);
    }
};

let viewCreateGender = async(req, res)=>{
    return res.render('gender/gender_create');
};

let createGender = async (req, res) => {
    const { nombre_genero, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_genero (
            nombre_genero, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_genero, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'gender', 'createGender', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/gender-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'gender', 'createGender', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_genero } = req.params;
    try {
        await db.query('SELECT id_genero, nombre_genero, estado FROM sat_genero WHERE id_genero = $1',[id_genero], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'gender', 'getById', err, false, req, res);
            }else{
                var gender = results.rows[0];
                return res.render('gender/gender_edit', { gender });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'gender', 'getById', error, false, req, res);
    }
};

let updateGender = async (req, res)=>{
    
    const { id_genero } = req.params;
    const { nombre_genero, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`UPDATE sat_genero
        SET nombre_genero = $1, fecha_mod_reg = $2, estado = $3, cod_usu_ing = $4, cod_usu_mod = $5
        WHERE id_genero = $6`, [nombre_genero, fecha_mod_reg, estado, cod_usu_ing, cod_usu_mod, id_genero], (err, results)=>{
            if(err){
                log('src/controllers/front', 'gender', 'updateGender', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/gender-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'gender', 'updateGender', error, false, req, res);
    }

};

module.exports = {
    genderList,
    viewCreateGender,
    createGender,
    getById,
    updateGender
}