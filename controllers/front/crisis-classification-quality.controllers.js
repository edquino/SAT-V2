const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let classificationQualityList = async(req, res) => {
    try {
        await db.query(`SELECT id_calidad_crisis, nombre_calidad_crisis, estado
        FROM sat_calidad_clasificacion_crisis ORDER BY id_calidad_crisis ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'crisis-classification-quality', 'classificationQualityList', err, false, req, res);
            }else{
                var crisisQualityList = results.rows;
                return res.render('crisis-classification-quality/quality_classification_list', { crisisQualityList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'crisis-classification-quality', 'classificationQualityList', err, false, req, res);
    }
};

let viewclassificationQuality = async(req, res)=>{
    return res.render('crisis-classification-quality/quality_classification_create');
};

let createClassificationQuality = async (req, res) => {
    const { nombre_calidad_crisis, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_calidad_clasificacion_crisis(
            nombre_calidad_crisis, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_calidad_crisis, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'crisis-classification-quality', 'createClassificationQuality', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/crisis-classification-quality-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'crisis-classification-quality', 'createClassificationQuality', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_calidad_crisis } = req.params;
    try {
        await db.query(`SELECT id_calidad_crisis, nombre_calidad_crisis, estado
        FROM sat_calidad_clasificacion_crisis
        WHERE id_calidad_crisis = $1`,[id_calidad_crisis], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'crisis-classification-quality', 'getById', err, false, req, res);
            }else{
                var crisisQuality = results.rows[0];
                return res.render('crisis-classification-quality/quality_classification_edit', { crisisQuality });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'crisis-classification-quality', 'getById', error, false, req, res);
    }
};

let updateClassificationQuality = async (req, res)=>{
    
    const { id_calidad_crisis } = req.params;
    const { nombre_calidad_crisis, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_calidad_clasificacion_crisis
        SET nombre_calidad_crisis=$1, fecha_mod_reg=$2, cod_usu_ing=$3, cod_usu_mod=$4, estado=$5
        WHERE id_calidad_crisis = $6`, [nombre_calidad_crisis, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_calidad_crisis], (err, results)=>{
            if(err){
                log('src/controllers/front', 'crisis-classification-quality', 'updateClassificationQuality', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/crisis-classification-quality-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'crisis-classification-quality', 'updateClassificationQuality', error, false, req, res);
    }

};

module.exports = {
    classificationQualityList,
    viewclassificationQuality,
    createClassificationQuality,
    getById,
    updateClassificationQuality
}