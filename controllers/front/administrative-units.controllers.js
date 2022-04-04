const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');
const { admin } = require('../../config/firebase-permissions');

let administrativeUnitsList = async(req, res) =>{
    try {
        await db.query(`SELECT id_unidad_administrativa, nombre_unidad, correo_prinicipal, estado
        FROM sat_unidad_administrativa`,(err,results)=>{
            if(err){
                log('src/controllers/front', 'administrative-units', 'administrativeUnitsList', err, false, req, res);
            }else{
                var administrativeUnits = results.rows;
                return res.render('administrative-units/administrative_units_list', {administrativeUnits});
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'administrative-units', 'administrativeUnitsList', error, false, req, res);
    }
};

let viewCreateAdministrativeUnit = async(req, res)=>{
    return res.render('administrative-units/administrative_units_create');
};

let createAdministrativeUnit = async (req, res) => {
    const { nombre_unidad, correo_prinicipal, correo_secundario, correo_tercero, estado} = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_unidad_administrativa(
            nombre_unidad, correo_prinicipal, correo_secundario, 
            correo_tercero, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`, [nombre_unidad, correo_prinicipal, correo_secundario, correo_tercero, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'administrative-units', 'createAdministrativeUnit', err, false, req, res);
            } else {
                req.flash('success', 'Registro creada correctamente');
                return res.redirect('/api-sat/administrative-units-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'administrative-units', 'createAdministrativeUnit', error, false, req, res);
    }
};

let getById = async(req, res)=>{
    const {id_unidad_administrativa} = req.params;

    try {
        await db.query(`SELECT id_unidad_administrativa, nombre_unidad, correo_prinicipal, correo_secundario, correo_tercero,  estado
        FROM sat_unidad_administrativa WHERE id_unidad_administrativa = $1`,[id_unidad_administrativa],(err,results)=>{
            if(err){
                log('src/controllers/front', 'administrative-units', 'getById', err, false, req, res);
            }else{
                var administrativeUnit = results.rows[0];
                return res.render('administrative-units/administrative_units_edit', {administrativeUnit});
            }
        });
    } catch (error) {
        log('src/controllers/front', 'administrative-units', 'getById', error, false, req, res);
    }
};

let updateAdministrativeUnit = async(req, res) =>{
    const {id_unidad_administrativa} = req.params;
    const {nombre_unidad, correo_prinicipal, correo_secundario, correo_tercero, estado} = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`UPDATE sat_unidad_administrativa
            SET nombre_unidad=$1, correo_prinicipal=$2, correo_secundario=$3, correo_tercero=$4, 
            fecha_mod_reg=$5, cod_usu_ing=$6, cod_usu_mod=$7, estado=$8
            WHERE id_unidad_administrativa = $9`, [nombre_unidad, correo_prinicipal, correo_secundario, correo_tercero, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_unidad_administrativa], (err, results)=>{
            if(err){
                log('src/controllers/front', 'administrative-units', 'getById', err, false, req, res);
            }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/administrative-units-list');
            }
        });
       
    } catch (error) {
        log('src/controllers/front', 'administrative-units', 'getById', error, false, req, res);

    }
};

let viewSendNotification = async(req, res)=>{
    return res.render('administrative-units/administrative_units_notify');
};


let sendNotification = async (req, res) => {
    const { mensaje } = req.body;

    try {
        var nombre_notificacion = 'UNIDAD INFORMATICA';
        var cod_usu = req.user.id_usuario;

        await db.query(`SELECT id_usuario, token FROM sat_seguridad_token`, async (err, results) => {

            if (err) {
                log('src/controllers/front', 'administrative-units', 'sendNotification', err, false, req, res);
            } else {
    
                var userTokens = results.rows;
                var tokens = [];
                
                for (let i = 0; i < userTokens.length; i++) {
    
                    if (userTokens[i].token != undefined) {
    
                        tokens.push(userTokens[i].token);
    
                        db.query(`INSERT INTO sat_notificacion(id_usuario, nombre_notificacion, mensaje, cod_usu_ing, cod_usu_mod)
                            VALUES ($1, $2, $3, $4, $5)`, [userTokens[i].id_usuario, nombre_notificacion, mensaje, cod_usu, cod_usu]);
                    }
    
                }   

                (async () => {
    
                    const message = {
                        tokens: tokens,
                        notification: {
                            body: mensaje,
                            title: nombre_notificacion
                        },
                        data: {
                            showForegroundNotification: 'false',
                        },
                        android: {
                            notification: {
                                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                            },
                        },
                        apns: {
                            payload: {
                                aps: {
                                    category: "FLUTTER_NOTIFICATION_CLICK"
                                }
                            }
                        },
                    };
                    admin.messaging().sendMulticast(message);
    
                })();

                req.flash('success','Notificaciones enviadas correctamente.');
                return res.redirect('/api-sat/administrative-units-list');


            }
    
        });  

    } catch (error) {
        log('src/controllers/front', 'administrative-units', 'sendNotification', error, false, req, res);
    }
}


module.exports = {
    administrativeUnitsList,
    viewCreateAdministrativeUnit,
    createAdministrativeUnit,
    getById,
    updateAdministrativeUnit,
    viewSendNotification,
    sendNotification

}