const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let populationTypeList = async(req, res) => {
    try {
        await db.query(`SELECT id_poblacion, nombre_poblacion, estado
        FROM sat_tipo_poblacion ORDER BY id_poblacion ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'population-type', 'populationTypeList', err, false, req, res);
            }else{
                var populationTypeList = results.rows;
                return res.render('population-type/population_type_list', { populationTypeList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'population-type', 'populationTypeList', err, false, req, res);
    }
};

let viewPopulationType = async(req, res)=>{
    return res.render('population-type/population_type_create');
};

let createPopultationType = async (req, res) => {
    const { nombre_poblacion, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_tipo_poblacion(
            nombre_poblacion, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_poblacion, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'population-type', 'createPopultationType', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/population-type-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'population-type', 'createPopultationType', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_poblacion } = req.params;
    try {
        await db.query(`SELECT id_poblacion, nombre_poblacion, estado
        FROM sat_tipo_poblacion
        WHERE id_poblacion = $1`,[id_poblacion], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'population-type', 'getById', err, false, req, res);
            }else{
                var populationType = results.rows[0];
                return res.render('population-type/population_type_edit', { populationType });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'population-type', 'getById', error, false, req, res);
    }
};

let updatePopulationType = async (req, res)=>{
    
    const { id_poblacion } = req.params;
    const { nombre_poblacion, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_tipo_poblacion
        SET nombre_poblacion= $1, fecha_mod_reg = $2, cod_usu_ing = $3, cod_usu_mod = $4, estado = $5
        WHERE id_poblacion = $6`, [nombre_poblacion, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_poblacion], (err, results)=>{
            if(err){
                log('src/controllers/front', 'population-type', 'updatePopulationType', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/population-type-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'population-type', 'updatePopulationType', error, false, req, res);
    }

};

module.exports = {
    populationTypeList,
    viewPopulationType,
    createPopultationType,
    getById,
    updatePopulationType
}