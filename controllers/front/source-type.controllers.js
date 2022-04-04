const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let fontsTypeList = async(req, res) => {
    try {
        await db.query('SELECT id_tipo_fuente, nombre_tipo_fuente, estado FROM sat_tipo_fuente ORDER BY id_tipo_fuente ASC ', (err, results)=>{
            if(err){
                log('src/controllers/front', 'type_fonts', 'viewTypeFonts', err, false, req, res);
            }else{
                var listTypeFonts = results.rows;
                return res.render('source_type/source_list', {listTypeFonts});
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'type_fonts', 'viewTypeFonts', error, false, req, res);
    }
};

let viewCreateTypeFont = async(req, res)=>{
    return res.render('source_type/source_create');
};

let createTypeFont = async (req, res) => {
    const { nombre_fuente, estado } = req.body;
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_reg = req.user.id_usuario;
    try {
        await db.query(`INSERT INTO sat_tipo_fuente(
            nombre_tipo_fuente, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_fuente, cod_usu_ing, cod_usu_reg, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'type_fonts', 'createTypeFont', err, false, req, res);
            } else {
                req.flash('success', 'Tipo de fuente creada correctamente');
                return res.redirect('/api-sat/source-type-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'type_fonts', 'createTypeFont', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_tipo_fuente } = req.params;
    try {
        await db.query('SELECT id_tipo_fuente, nombre_tipo_fuente, estado FROM sat_tipo_fuente WHERE id_tipo_fuente = $1',[id_tipo_fuente], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'type_fonts', 'getById', err, false, req, res);
            }else{
                var typeSource = results.rows[0];
                return res.render('source_type/source_edit', { typeSource });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'type_fonts', 'getById', error, false, req, res);
    }
};

let updateFontType = async (req, res)=>{

    const { id_tipo_fuente } = req.params;
    const { nombre_tipo_fuente, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_tipo_fuente
        SET nombre_tipo_fuente= $1, fecha_mod_reg=$2, cod_usu_ing=$3, cod_usu_mod=$4, estado=$5
        WHERE id_tipo_fuente= $6`, [nombre_tipo_fuente, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_tipo_fuente], (err, results)=>{
            if(err){
                log('src/controllers/front', 'fonts-type', 'updateFontType', err, false, req, res);
            }else{
                req.flash('warning', 'Tipo de fuente actualizado correctamente');
                return res.redirect('/api-sat/source-type-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'fonts-type', 'updateFontType', error, false, req, res);
    }

};


module.exports = {
    fontsTypeList,
    viewCreateTypeFont,
    createTypeFont,
    getById,
    updateFontType
}