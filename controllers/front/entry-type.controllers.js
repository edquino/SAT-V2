const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let entryTypeList = async(req, res) => {

    try {
        await db.query(`SELECT id_entrada, nombre_entrada, estado
        FROM sat_tipo_entrada ORDER BY id_entrada ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'entry-type', 'entryTypeList', err, false, req, res);
            }else{
                var entryTypeList = results.rows;
                return res.render('entry-type/entry_type_list', { entryTypeList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'entry-type', 'entryTypeList', error, false, req, res);
    }
};

let viewEntryType = async(req, res)=>{
    return res.render('entry-type/entry_type_create');
};

let createEntryType = async (req, res) => {
    const { nombre_entrada, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_tipo_entrada (
            nombre_entrada, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_entrada, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'entry-type', 'createZEntryType', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/entry-type-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'entry-type', 'createZEntryType', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_entrada } = req.params;
    try {
        await db.query('SELECT id_entrada, nombre_entrada, estado FROM sat_tipo_entrada WHERE id_entrada = $1',[id_entrada], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'entry-type', 'getById', err, false, req, res);
            }else{
                var entryType = results.rows[0];
                return res.render('entry-type/entry_type_edit', { entryType });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'entry-type', 'getById', error, false, req, res);
    }
};

let updateEntryTpe = async (req, res)=>{
    
    const { id_entrada } = req.params;
    const { nombre_entrada, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`UPDATE sat_tipo_entrada
        SET nombre_entrada = $1, fecha_mod_reg = $2, estado = $3, cod_usu_ing = $4, cod_usu_mod = $5
        WHERE id_entrada = $6`, [nombre_entrada, fecha_mod_reg, estado, cod_usu_ing, cod_usu_mod, id_entrada], (err, results)=>{
            if(err){
                log('src/controllers/front', 'entry-type', 'updateEntryTpe', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/entry-type-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'zone', 'updateEntryTpe', error, false, req, res);
    }

};

module.exports = {
    entryTypeList,
    viewEntryType,
    createEntryType,
    getById,
    updateEntryTpe
}