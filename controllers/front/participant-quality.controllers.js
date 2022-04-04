const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let participantQualityList = async(req, res) => {
    try {
        await db.query(`SELECT id_calidad_participa, nombre_calidad_participa, estado
        FROM sat_calidad_clasificacion_participa ORDER BY id_calidad_participa ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'participant-quality', 'participantQualityList', err, false, req, res);
            }else{
                var participantQualityList = results.rows;
                return res.render('participant-quality/participant_quality_list', { participantQualityList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'participant-quality', 'participantQualityList', err, false, req, res);
    }
};

let viewParticipantQuality = async(req, res)=>{
    return res.render('participant-quality/participant_quality_create');
};

let createParticipantQuality = async (req, res) => {
    const { nombre_calidad_participa, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_calidad_clasificacion_participa(
            nombre_calidad_participa, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_calidad_participa, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'participant-quality', 'createParticipantQuality', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/participant-quality-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'participant-quality', 'createParticipantQuality', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_calidad_participa } = req.params;
    try {
        await db.query(`SELECT id_calidad_participa, nombre_calidad_participa, estado
        FROM sat_calidad_clasificacion_participa
        WHERE id_calidad_participa = $1`,[id_calidad_participa], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'crisis-classification-quality', 'getById', err, false, req, res);
            }else{
                var participantQuality = results.rows[0];
                return res.render('participant-quality/participant_quality_edit', { participantQuality });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'crisis-classification-quality', 'getById', error, false, req, res);
    }
};

let updateParticipantQuality = async (req, res)=>{
    
    const { id_calidad_participa } = req.params;
    const { nombre_calidad_participa, estado } = req.body;

        
    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_calidad_clasificacion_participa
        SET nombre_calidad_participa=$1, fecha_mod_reg=$2, cod_usu_ing=$3, cod_usu_mod=$4, estado=$5
        WHERE id_calidad_participa = $6`, [nombre_calidad_participa, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_calidad_participa], (err, results)=>{
            if(err){
                log('src/controllers/front', 'participant-quality', 'updateParticipantQuality', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/participant-quality-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'participant-quality', 'updateParticipantQuality', error, false, req, res);
    }

};

module.exports = {
    participantQualityList,
    viewParticipantQuality,
    createParticipantQuality,
    getById,
    updateParticipantQuality
}