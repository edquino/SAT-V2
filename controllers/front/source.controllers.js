const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let sourceList = async(req, res) => {
    
    try {
        await db.query(`SELECT id_fuente, nombre_fuente, estado 
        FROM sat_fuente 
        ORDER BY id_fuente ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'source', 'sourceList', err, false, req, res);
            }else{
                var sourceList = results.rows;
                return res.render('source/source_list', { sourceList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'source', 'sourceList', error, false, req, res);
    }
};

let viewSource = async(req, res)=>{
    return res.render('source/source_create');
};

let createSource = async (req, res) => {
    const { nombre_fuente, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_fuente (
            nombre_fuente, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_fuente, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'source', 'createSource', err, false, req, res);
            } else {
                req.flash('success', 'Tipo de fuente creada correctamente');
                return res.redirect('/api-sat/source-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'source', 'createSource', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_fuente } = req.params;
    try {
        await db.query('SELECT id_fuente, nombre_fuente, estado FROM sat_fuente WHERE id_fuente = $1',[id_fuente], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'source', 'getById', err, false, req, res);
            }else{
                var source = results.rows[0];
                return res.render('source/source_edit', { source });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'source', 'getById', error, false, req, res);
    }
};

let updateSource = async (req, res)=>{
    
    const { id_fuente } = req.params;
    const { nombre_fuente, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_fuente
        SET nombre_fuente = $1, fecha_mod_reg = $2, 
        cod_usu_ing = $3, cod_usu_mod = $4, estado = $5
        WHERE id_fuente = $6 RETURNING *`, [nombre_fuente, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_fuente], (err, results)=>{
            if(err){
                log('src/controllers/front', 'source', 'updateSource', err, false, req, res);
            }else{
                req.flash('warning', 'Tipo de fuente actualizado correctamente');
                return res.redirect('/api-sat/source-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'source', 'updateSource', error, false, req, res);
    }

};


module.exports = {
    sourceList,
    viewSource,
    createSource,
    getById,
    updateSource,
    updateSource
}