const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let topicList = async(req, res) => {

    try {
        await db.query(`SELECT id_tema, nombre_tema, estado
        FROM sat_temas ORDER BY id_tema ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'topic', 'topicList', err, false, req, res);
            }else{
                var topicList = results.rows;
                return res.render('topic/topic_list', { topicList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'topic', 'topicList', error, false, req, res);
    }
};

let viewCreateTopic = async(req, res)=>{
    return res.render('topic/topic_create');
};

let createTopic = async (req, res) => {
    const { nombre_tema, estado } = req.body;
    
    var cod_usu = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_temas(
            nombre_tema, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4)`, [nombre_tema, cod_usu, cod_usu, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'thema', 'createThema', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/topic-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'thema', 'createThema', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_tema } = req.params;
    try {
        await db.query(`SELECT id_tema, nombre_tema, estado
        FROM sat_temas WHERE id_tema = $1`,[id_tema], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'topic', 'getById', err, false, req, res);
            }else{
                var topic = results.rows[0];
                return res.render('topic/topic_edit', { topic });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'topic', 'getById', error, false, req, res);
    }
};

let updateTopic = async (req, res)=>{
    
    const { id_tema } = req.params;
    const { nombre_tema, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu = req.user.id_usuario;


    try {

        await db.query(`UPDATE sat_temas
        SET nombre_tema=$1, fecha_mod_reg=$2, cod_usu_ing=$3, cod_usu_mod=$4, estado=$5
        WHERE id_tema=$6`, [nombre_tema, fecha_mod_reg, cod_usu, cod_usu, estado, id_tema], (err, results)=>{
            if(err){
                log('src/controllers/front', 'topic', 'updateTopic', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/topic-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'topic', 'updateTopic', error, false, req, res);
    }

};

module.exports = {
    topicList,
    viewCreateTopic, 
    createTopic,
    getById,
    updateTopic
}
