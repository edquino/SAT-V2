const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let subtopicList = async(req, res) => {

    try {

        await db.query(`SELECT st.id_subtema, st.id_tema, t.nombre_tema, st.nombre_subtema, st.estado
        FROM sat_subtemas AS st 
        INNER JOIN sat_temas AS t ON t.id_tema = st.id_tema ORDER BY st.id_subtema DESC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'subtopic', 'subtopicList', err, false, req, res);
            }else{
                var subtopic = results.rows;
                return res.render('subtopic/subtopic_list', { subtopic });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'subtopic', 'subtopicList', error, false, req, res);
    }
};

let viewCreateSubtopic = async(req, res)=>{
    try {
    
    await db.query(`SELECT id_tema, nombre_tema FROM sat_temas 
    WHERE estado = 1`,(err, results)=>{
        if(err){
            log('src/controllers/front', 'subtopic', 'viewCreateSubtopic', err, false, req, res);
        }else{
            var topic = results.rows;
            return res.render('subtopic/subtopic_create', {topic});
        }
    });
   
    } catch (error) {
        log('src/controllers/front', 'subtopic', 'viewCreateSubtopic', error, false, req, res);

    }
};

let createSubtopic = async (req, res) => {
    const { nombre_subtema, id_tema, estado } = req.body;
    
    var cod_usu = req.user.id_usuario;
  
    try {
        await db.query(`INSERT INTO sat_subtemas(
            nombre_subtema, id_tema, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4, $5)`, [nombre_subtema, id_tema, cod_usu, cod_usu, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'subtopic', 'createSubtopic', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/subtopic-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'subtopic', 'createSubtopic', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_subtema } = req.params;
    try {

        let topic = await db.query(`SELECT id_tema, nombre_tema FROM sat_temas 
        WHERE estado = 1`);
        topic = topic.rows;

        await db.query(`SELECT st.id_subtema, st.id_tema, t.nombre_tema, st.nombre_subtema
        FROM sat_subtemas AS st 
        INNER JOIN sat_temas AS t ON t.id_tema = st.id_tema
		WHERE st.id_subtema = $1`,[id_subtema], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'subtopic', 'getById', err, false, req, res);
            }else{
                var subtopic = results.rows[0];
                return res.render('subtopic/subtopic_update', { subtopic, topic });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'subtopic', 'getById', error, false, req, res);
    }
};

let updateSubtopic = async (req, res)=>{
    
    const { id_subtema } = req.params;
    const { id_tema, nombre_subtema, estado } = req.body;
    
    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_subtemas
        SET nombre_subtema=$1, id_tema=$2, fecha_mod_reg=$3, cod_usu_ing=$4, cod_usu_mod=$5, estado=$6
        WHERE id_subtema = $7;`, [nombre_subtema, id_tema, fecha_mod_reg, cod_usu, cod_usu, estado, id_subtema], (err, results)=>{
            if(err){
                log('src/controllers/front', 'subtopic', 'updateSubtopic', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/subtopic-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'subtopic', 'updateSubtopic', error, false, req, res);
    }

};

module.exports = {
    subtopicList,
    viewCreateSubtopic,
    createSubtopic,
    getById, 
    updateSubtopic
}
