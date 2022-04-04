const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let conflictSituationList = async(req, res) => {

    try {
        await db.query(`SELECT sc.id_situacion_conflictiva, t.nombre_tema, st.nombre_subtema, sc.nombre_sit_conflictiva, sc.id_subtema, sc.estado
        FROM sat_situacion_conflictiva AS sc
        INNER JOIN sat_subtemas AS st ON st.id_subtema = sc.id_subtema
        INNER JOIN sat_temas AS t ON t.id_tema = st.id_tema 
        ORDER BY sc.id_situacion_conflictiva DESC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'conflict-situation', 'conflictSituationList', err, false, req, res);
            }else{
                var conflictSituation = results.rows;
                return res.render('situation/conflict_situation_list', { conflictSituation });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'conflictSituationList', error, false, req, res);
    }
};

let viewCreateConflictSituation = async(req, res)=>{

    try {
     
    let topic = await db.query(`SELECT id_tema, nombre_tema FROM sat_temas 
    WHERE estado = 1`);
    topic = topic.rows;

    let subtopic = await db.query(`SELECT id_subtema, nombre_subtema FROM sat_subtemas
    WHERE estado = 1`);
    subtopic = subtopic.rows;

    return res.render('situation/conflict_situation_create', {topic, subtopic});

    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'viewCreateConflictSituation', error, false, req, res);
    }

};

let createConflictSituation = async (req, res) => {
    const { nombre_sit_conflictiva, id_subtema, estado } = req.body;
    
    var cod_usu = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_situacion_conflictiva(
            nombre_sit_conflictiva, id_subtema, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4, $5)`, [nombre_sit_conflictiva, id_subtema, cod_usu, cod_usu, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'conflict-situation', 'createAggressionType', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/situation-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'createAggressionType', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_situacion_conflictiva } = req.params;
    try {

        let subtopic = await db.query(`SELECT id_subtema, nombre_subtema FROM sat_subtemas
        WHERE estado = 1`);
        subtopic = subtopic.rows;

        await db.query(`SELECT sc.id_situacion_conflictiva, t.nombre_tema, st.nombre_subtema, sc.nombre_sit_conflictiva, sc.id_subtema, sc.estado
        FROM sat_situacion_conflictiva AS sc
        INNER JOIN sat_subtemas AS st ON st.id_subtema = sc.id_subtema
        INNER JOIN sat_temas AS t ON t.id_tema = st.id_tema 
        WHERE id_situacion_conflictiva = $1`,[id_situacion_conflictiva], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'conflict-situation', 'getById', err, false, req, res);
            }else{
                var conflictSituation = results.rows[0];
                return res.render('situation/conflict_situation_edit', { conflictSituation, subtopic });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'getById', error, false, req, res);
    }
};

let updateConflictSituation = async (req, res)=>{
    
    const { id_situacion_conflictiva } = req.params;
    const { nombre_sit_conflictiva, id_subtema, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_situacion_conflictiva
        SET nombre_sit_conflictiva=$1, id_subtema=$2, fecha_mod_reg=$3, cod_usu_ing=$4, cod_usu_mod=$5, estado=$6
        WHERE id_situacion_conflictiva=$7`, [nombre_sit_conflictiva, id_subtema, fecha_mod_reg, cod_usu, cod_usu, estado, id_situacion_conflictiva], (err, results)=>{
            if(err){
                log('src/controllers/front', 'conflict-situation', 'updateConflictSituation', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/conflict-situation-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'updateConflictSituation', error, false, req, res);
    }

};

module.exports = {
    conflictSituationList,
    viewCreateConflictSituation,
    createConflictSituation,
    getById,
    updateConflictSituation
}
