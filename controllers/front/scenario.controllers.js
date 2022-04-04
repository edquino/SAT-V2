const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let scenarioList = async(req, res) => {
    
    try {
        await db.query('SELECT id_escenario, nombre_escenario, estado FROM sat_escenario ORDER BY id_escenario ASC', (err, results)=>{
            if(err){
                log('src/controllers/front', 'scenario', 'scenarioList', err, false, req, res);
            }else{
                var scenarioList = results.rows;
                return res.render('scenario/scenario_list', { scenarioList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'scenario', 'scenarioList', error, false, req, res);
    }
};

let viewScenario = async(req, res)=>{
    return res.render('scenario/scenario_create');
};

let createScenario = async (req, res) => {
    const { nombre_escenario, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_escenario (
            nombre_escenario, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_escenario, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'scenario', 'createScenario', err, false, req, res);
            } else {
                req.flash('success', 'Escenario creado correctamente');
                return res.redirect('/api-sat/scenario-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'scenario', 'createScenario', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_escenario } = req.params;
    try {
        await db.query('SELECT id_escenario, nombre_escenario, estado FROM sat_escenario WHERE id_escenario = $1',[id_escenario], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'scenario', 'getById', err, false, req, res);
            }else{
                var scenario = results.rows[0];
                return res.render('scenario/scenario_edit', { scenario });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'scenario', 'getById', error, false, req, res);
    }
};

let updateScenario = async (req, res)=>{
    
    const { id_escenario } = req.params;
    const { nombre_escenario, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_escenario
        SET nombre_escenario=$1, fecha_mod_reg=$2, cod_usu_ing=$3, cod_usu_mod=$4,  estado=$5
        WHERE id_escenario=$6`, [nombre_escenario, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_escenario], (err, results)=>{
            if(err){
                log('src/controllers/front', 'scenario', 'updateScenario', err, false, req, res);
             }else{
                req.flash('warning', 'Escenario actualizado correctamente');
                return res.redirect('/api-sat/scenario-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'scenario', 'updateScenario', error, false, req, res);
    }

};


module.exports = {
    scenarioList,
    viewScenario,
    createScenario,
    getById,
    updateScenario

}