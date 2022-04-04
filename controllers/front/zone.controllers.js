const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let zoneList = async(req, res) => {
    
    try {
        await db.query('SELECT id_zona, nombre_zona, estado FROM sat_zonas ORDER BY id_zona ASC', (err, results)=>{
            if(err){
                log('src/controllers/front', 'zone', 'zoneList', err, false, req, res);
            }else{
                var zonaList = results.rows;
                return res.render('zone/zone_list', { zonaList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'zone', 'zoneList', error, false, req, res);
    }
};

let viewZone = async(req, res)=>{
    return res.render('zone/zone_create');
};

let createZone = async (req, res) => {
    const { nombre_zona, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_zonas (
            nombre_zona, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_zona, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'zone', 'createZone', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/zone-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'zone', 'createZone', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_zona } = req.params;
    try {
        await db.query('SELECT id_zona, nombre_zona, estado FROM sat_zonas WHERE id_zona = $1',[id_zona], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'zone', 'getById', err, false, req, res);
            }else{
                var zone = results.rows[0];
                return res.render('zone/zone_edit', { zone });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'zone', 'getById', error, false, req, res);
    }
};

let updateZone = async (req, res)=>{
    
    const { id_zona } = req.params;
    const { nombre_zona, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`UPDATE sat_zonas
        SET nombre_zona = $1, fecha_mod_reg = $2, estado = $3, cod_usu_ing = $4, cod_usu_mod = $5
        WHERE id_zona = $6`, [nombre_zona, fecha_mod_reg, estado, cod_usu_ing, cod_usu_mod, id_zona], (err, results)=>{
            if(err){
                log('src/controllers/front', 'zone', 'updateZone', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/zone-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'zone', 'updateZone', error, false, req, res);
    }

};

module.exports = {
    zoneList,
    viewZone,
    createZone,
    getById,
    updateZone
}