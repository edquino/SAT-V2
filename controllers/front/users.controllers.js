const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let usersList = async (req, res) => {
    try {
        
        //let userInSession = req.user.id_perfil;
        let userInSession = req.user.id_usuario;
        
        await db.query(
            /*
            `SELECT u.id_usuario, u.usuario, u.nombre, u.apellido, u.usuario, u.fec_nacimiento, u.correo, u.clave, u.estado_reg, u.id_perfil, up.descripcion AS perfil
            FROM usuario AS u
            INNER JOIN perfil AS up ON up.id_perfil = u.id_perfil
            WHERE u.id_perfil != $1`*/
            `
            SELECT id_usuario, usuario, nombre,
		            apellido, fec_nacimiento, correo_electronico AS correo, 
		            clave, est_usuario AS estado_reg, telefono AS perfil
            FROM segd_usuario AS u
            WHERE u.id_usuario != $1
            ORDER BY id_usuario ASC`
            ,
        [userInSession], (err, results) => {
            if (err) {
                log('src/controllers/front', 'users', 'usersList', err, false, req, res);
            } else {
                var users = results.rows;
                res.render('users/users_list', { users });
            }
        });

    } catch (error) {
        log('src/controllers/front', 'users', 'usersList', error, false, req, res);
    }
};

let getById = async (req, res) => {
    const { id_usuario } = req.params;
    try {

        // let SIGIuser = await db.query(`SELECT u.id_usuario, u.usuario, u.nombre, u.apellido, u.correo, u.id_perfil,
        // p.descripcion FROM usuario AS u INNER JOIN perfil AS p ON p.id_perfil = u.id_perfil WHERE u.id_usuario = $1`, [id_usuario]);
        // SIGIuser = SIGIuser.rows[0];

        let SIGIuser = await db.query(`SELECT u.id_usuario, u.usuario, u.nombre, u.apellido, u.correo_electronico AS correo FROM segd_usuario AS u WHERE u.id_usuario = $1`, [id_usuario]);
        SIGIuser = SIGIuser.rows[0];

        // Obtiene los permisos de Lectura y Edicion. Utilizada para Asignar permisos
        let dataAuthorization = await db.query('SELECT id_rol_permisos, nombre_permiso FROM sat_rol_app_permisos WHERE estado = 1 ORDER BY id_rol_permisos ASC');
        dataAuthorization = dataAuthorization.rows;

        //Obtiene la lista de modulos de la aplicacion. Alerta, atencion a crisis y dashboard.
        let moduleAppAutorization = await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE tipo_modulo = 1 ORDER BY id_modulo ASC');
        moduleAppAutorization = moduleAppAutorization.rows;

        //Obtiene la lista de modulos del dashboard web. Alerta, atencion a crisis y dashboard.
        let moduleWebAutorization = await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE tipo_modulo = 2 ORDER BY id_modulo ASC');
        moduleWebAutorization = moduleWebAutorization.rows;

        // Obtiene los permisos de consulta, tecnico, supervisor y analista. Utilizada para Actualizar permisos
        let readAndModifyPermissions = await db.query('SELECT id_rol_permisos, nombre_permiso FROM sat_rol_app_permisos WHERE estado = 1 ORDER BY id_rol_permisos ASC');
        readAndModifyPermissions = readAndModifyPermissions.rows;

        //***** 
        let searchUserAccess = await db.query(`SELECT id_usuario FROM sat_accesos_usuario AS acc
        WHERE id_usuario = $1`, [id_usuario]);
        searchUserAccess = searchUserAccess.rows[0];


        var userAuthorization;
        var modulsAppAndUser = [];
        var modulsWebAndUser = [];

        if (searchUserAccess != undefined) {

            userAuthorization = await db.query(`SELECT acc.id_usuario, acc.permiso_acceso_app, 
            acc.permiso_acceso_web, acc.id_rol_permisos, app.nombre_permiso
            FROM sat_accesos_usuario AS acc
            INNER JOIN sat_rol_app_permisos AS app ON app.id_rol_permisos = acc.id_rol_permisos
            WHERE acc.id_usuario = $1`, [id_usuario]);
            userAuthorization = userAuthorization.rows[0];

            // Obtener los permisos de consulta, tecnico, supervisor, analista del usuario. 
            for (let i = 0; i < readAndModifyPermissions.length; i++) {
                readAndModifyPermissions[i].checked;
                if (readAndModifyPermissions[i].id_rol_permisos == userAuthorization.id_rol_permisos) {
                    readAndModifyPermissions[i].checked = 'checked';
                } else {
                    readAndModifyPermissions[i].checked = '';
                }
            }
        }

        //Get List of User Modules (APP) 
        let autorizacionAppModulsUser = await db.query(`SELECT pu.id_usuario, pu.id_modulo, m.nombre_modulo, m.tipo_modulo, pu.estado
        FROM sat_permisos_modulos_usuario AS pu
        INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
            WHERE pu.id_usuario = $1 AND m.tipo_modulo = 1`, [id_usuario]);
        autorizacionAppModulsUser = autorizacionAppModulsUser.rows;

        //Get List of User Modules (WEB)
        let autorizacionWebModulsUser = await db.query(`SELECT pu.id_usuario, pu.id_modulo, m.nombre_modulo, m.tipo_modulo, pu.estado
        FROM sat_permisos_modulos_usuario AS pu
        INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
            WHERE pu.id_usuario = $1 AND m.tipo_modulo = 2`, [id_usuario]);
        autorizacionWebModulsUser = autorizacionWebModulsUser.rows;
        //*****

        modulsAppAndUser = []; // Guarda de modulos del APP asignados al usuario y los que no han sido asignados.
        var idModulsNotAuthorized = [];
        var idModulstAuthorizedUser = [];
        var modulAutAndNotAuth = [];

        if (autorizacionAppModulsUser.length > 0) {
            for (let j = 0; j < autorizacionAppModulsUser.length; j++) { //recorrer la lista de modulos asignados al usuario.
                for (let i = 0; i < moduleAppAutorization.length; i++) { //recorrer la lista de los modulos de la aplicacion.
                    var id_module = moduleAppAutorization[i].id_modulo; //Obtener los ids de los modulos.               

                    if (moduleAppAutorization[i].id_modulo != autorizacionAppModulsUser[j].id_modulo) { //Comparar los modulos de la aplicacion y el usuario. Si el modulo es disinto significa, que no ha sido asignado al usuario.  

                        var getUserModules = await db.query(`SELECT pu.id_modulo, m.nombre_modulo 
                            FROM sat_permisos_modulos_usuario AS pu
                            INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
                            WHERE pu.id_modulo = $1 AND pu.id_usuario = $2`, [id_module, id_usuario]);
                        getUserModules = getUserModules.rows[0]; // Buscar y Obtener los ids de modulos que han sido autorizados al usuario. Guardarlos en un arreglo y asignar el valor a la variable checked.

                        if (getUserModules == undefined) {
                            idModulsNotAuthorized.push(id_module);
                        }

                        for (let k = 0; k < idModulsNotAuthorized.length; k++) { //Se recorre la lista de ids de los modulos de la aplicacion y los ids de los modulos al usuario usuario 
                            if (modulAutAndNotAuth.sort().indexOf(idModulsNotAuthorized[k]) === -1) { //si encuentra un Id repetido lo elimina. 
                                modulAutAndNotAuth.push(idModulsNotAuthorized[k]); //el arreglo listModulsApp[] guardará la lista de ids de los modulos de aplicacion no autorizados y de los modulos autorizados al usuario.  
                            }
                        }

                    } else {

                        idModulstAuthorizedUser.push(id_module); //Si la variable getUserModules (List Moduls) no obtiene un valor indefinido. Entonces los ids pertencen a los modulos que el usuario está autorizado y se guardan en el arreglo idModules                    

                        for (let l = 0; l < idModulstAuthorizedUser.length; l++) { //Se recorre la lista de ids de los modulos de la aplicacion y los ids de los modulos al usuario usuario 
                            if (modulAutAndNotAuth.sort().indexOf(idModulstAuthorizedUser[l]) === -1) { //si encuentra un Id repetido lo elimina. 
                                modulAutAndNotAuth.push(idModulstAuthorizedUser[l]); //el arreglo listModulsApp[] guardará la lista de ids de los modulos de aplicacion no autorizados y de los modulos autorizados al usuario.  
                            }
                        }
                    }
                }
            }

        } else {

            let modulesAplication = await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE tipo_modulo = 1 ORDER BY id_modulo ASC');
            modulesAplication = modulesAplication.rows;

            var checked = '';

            for (let k = 0; k < modulesAplication.length; k++) {
                modulsAppAndUser.sort().push({ id_modulo: modulesAplication[k].id_modulo, nombre_modulo: modulesAplication[k].nombre_modulo, checked });
            }

        }

        for (let i = 0; i < modulAutAndNotAuth.length; i++) {

            var UserModules = await db.query(`SELECT pu.id_modulo, m.nombre_modulo 
                FROM sat_permisos_modulos_usuario AS pu
                INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
                WHERE pu.id_modulo = $1 AND pu.id_usuario = $2`, [modulAutAndNotAuth[i], id_usuario]);
            UserModules = UserModules.rows[0]; // Buscar y Obtener los ids de modulos que han sido autorizados al usuario. Guardarlos en un arreglo y asignar el valor a la variable checked.        


            if (UserModules != undefined) {
                var checked = 'checked';
                modulsAppAndUser.sort().push({ id_modulo: UserModules.id_modulo, nombre_modulo: UserModules.nombre_modulo, checked })
            } else {
                var checked = '';

                var modulesTypeApp = await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE id_modulo = $1 AND tipo_modulo = 1', [modulAutAndNotAuth[i]]);
                modulesTypeApp = modulesTypeApp.rows[0];
                modulsAppAndUser.sort().push({ id_modulo: modulesTypeApp.id_modulo, nombre_modulo: modulesTypeApp.nombre_modulo, checked })
            }

        }

        //*****

        modulsWebAndUser = []; // Guarda los modulos WEB asignados al usuario y los que no han sido asignados.
        var idModulsWebNotAuthorized = [];
        var modulWebAutAndNotAuth = [];
        var idModulsWebtAuthorizedUser = [];


        if (autorizacionWebModulsUser.length > 0) {
            for (let j = 0; j < autorizacionWebModulsUser.length; j++) { //recorrer la lista de modulos asignados al usuario.
                for (let i = 0; i < moduleWebAutorization.length; i++) { //recorrer la lista de los modulos de la aplicacion.
                    var id_module = moduleWebAutorization[i].id_modulo; //Obtener los ids de los modulos.               
                    if (moduleWebAutorization[i].id_modulo != autorizacionWebModulsUser[j].id_modulo) { //Comparar los modulos de la aplicacion y el usuario. Si el modulo es disinto significa, que no ha sido asignado al usuario.  

                        var getUserModules = await db.query(`SELECT pu.id_modulo, m.nombre_modulo 
                        FROM sat_permisos_modulos_usuario AS pu
                        INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
                        WHERE pu.id_modulo = $1 AND pu.id_usuario = $2`, [id_module, id_usuario]);
                        getUserModules = getUserModules.rows[0]; // Buscar y Obtener los ids de modulos que han sido autorizados al usuario. Guardarlos en un arreglo y asignar el valor a la variable checked.

                        if (getUserModules == undefined) {
                            idModulsWebNotAuthorized.push(id_module);
                        }

                        for (let k = 0; k < idModulsWebNotAuthorized.length; k++) { //Se recorre la lista de ids de los modulos de la aplicacion y los ids de los modulos al usuario usuario 
                            if (modulWebAutAndNotAuth.sort().indexOf(idModulsWebNotAuthorized[k]) === -1) { //si encuentra un Id repetido lo elimina. 
                                modulWebAutAndNotAuth.push(idModulsWebNotAuthorized[k]); //el arreglo listModulsApp[] guardará la lista de ids de los modulos de aplicacion no autorizados y de los modulos autorizados al usuario.  
                            }
                        }

                    } else {

                        idModulsWebtAuthorizedUser.push(id_module); //Si la variable getUserModules (List Moduls) no obtiene un valor indefinido. Entonces los ids pertencen a los modulos que el usuario está autorizado y se guardan en el arreglo idModules                    

                        for (let l = 0; l < idModulsWebtAuthorizedUser.length; l++) { //Se recorre la lista de ids de los modulos de la aplicacion y los ids de los modulos al usuario usuario 
                            if (modulWebAutAndNotAuth.sort().indexOf(idModulsWebtAuthorizedUser[l]) === -1) { //si encuentra un Id repetido lo elimina. 
                                modulWebAutAndNotAuth.push(idModulsWebtAuthorizedUser[l]); //el arreglo listModulsApp[] guardará la lista de ids de los modulos de aplicacion no autorizados y de los modulos autorizados al usuario.  
                            }
                        }
                    }
                }
            }

        } else {

            let modulesAplication = await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE tipo_modulo = 2 ORDER BY id_modulo ASC');
            modulesAplication = modulesAplication.rows;

            var checked = '';

            for (let k = 0; k < modulesAplication.length; k++) {
                modulsWebAndUser.sort().push({ id_modulo: modulesAplication[k].id_modulo, nombre_modulo: modulesAplication[k].nombre_modulo, checked });
            }

        }

        for (let i = 0; i < modulWebAutAndNotAuth.length; i++) {

            var UserModulesWeb = await db.query(`SELECT pu.id_modulo, m.nombre_modulo 
            FROM sat_permisos_modulos_usuario AS pu
            INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
            WHERE pu.id_modulo = $1 AND pu.id_usuario = $2`, [modulWebAutAndNotAuth[i], id_usuario]);
            UserModulesWeb = UserModulesWeb.rows[0]; // Buscar y Obtener los ids de modulos que han sido autorizados al usuario. Guardarlos en un arreglo y asignar el valor a la variable checked.        

            if (UserModulesWeb != undefined) {
                var checked = 'checked';
                modulsWebAndUser.sort().push({ id_modulo: UserModulesWeb.id_modulo, nombre_modulo: UserModulesWeb.nombre_modulo, checked })
            } else {
                var checked = '';

                var modulesTypeWeb = await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE id_modulo = $1 AND tipo_modulo = 2', [modulWebAutAndNotAuth[i]]);
                modulesTypeWeb = modulesTypeWeb.rows[0];
                modulsWebAndUser.sort().push({ id_modulo: modulesTypeWeb.id_modulo, nombre_modulo: modulesTypeWeb.nombre_modulo, checked })
            }

        }

        res.render('users/users_authotization', { SIGIuser, dataAuthorization, moduleAppAutorization, moduleWebAutorization, userAuthorization, modulsAppAndUser, modulsWebAndUser, readAndModifyPermissions });

    } catch (error) {
        log('src/controllers/front', 'users', 'getById', error, false, req, res);
    }

};

let usersAuthotization = async (req, res) => {
    const { id_usuario, permiso_acceso_app, permiso_acceso_web, id_rol_permisos, id_modulo_app, id_modulo_web } = req.body;
    
    var acceso_app = permiso_acceso_app;
    var acceso_web = permiso_acceso_web;
    var permisosDatos =  id_rol_permisos;

    if(permiso_acceso_app == undefined && permiso_acceso_web == undefined && id_rol_permisos == undefined){
        req.flash('delete', 'No se marco ninguna de las opciones');
        return res.redirect(`/api-sat/users/${id_usuario}/edit-view`)
    }

    if (acceso_app == 1) {
        if (id_modulo_app == undefined) {
            req.flash('delete', 'El Acceso APP fue permitido, pero ningún permiso fue asignado');
            return res.redirect(`/api-sat/users/${id_usuario}/edit-view`)
        }
    }else{
        acceso_app = 0;
    }

    if (acceso_web == 1) {
        if (id_modulo_web == undefined) {
            req.flash('delete', 'El Acceso WEB fue permitido, pero ningún permiso fue asignado');
            return res.redirect(`/api-sat/users/${id_usuario}/edit-view`)
        }
    }else{
        acceso_web = 0;
    }

    if(permisosDatos == undefined){
        permisosDatos = 1
    }

    try {

        var cod_usu_ing = req.user.id_usuario;
        var cod_usu_mod = req.user.id_usuario;

        await db.query(`INSERT INTO sat_accesos_usuario(
            id_usuario, permiso_acceso_app, permiso_acceso_web, id_rol_permisos, 
            cod_usu_ing, cod_usu_mod)
            VALUES ($1, $2, $3, $4, $5, $6)`, [id_usuario, acceso_app, acceso_web, permisosDatos, cod_usu_ing, cod_usu_mod], async (err, results) => {
            if (err) {
                log('src/controllers/front', 'users', 'usersAuthotization', err, false, req, res);
            } else {
                //var Useraccess = results.rows[0];
                if (acceso_app == 1) {
                    if (id_modulo_app != undefined) {

                        for (let i = 0; i < id_modulo_app.length; i++) {
                            await db.query(`INSERT INTO sat_permisos_modulos_usuario(
                                    id_usuario, id_modulo, cod_usu_ing, cod_usu_mod)
                                    VALUES ($1, $2, $3, $4)`, [id_usuario, id_modulo_app[i], cod_usu_ing, cod_usu_mod]);
                        }
                    }
                }

                if (acceso_web == 1) {
                    if (id_modulo_web != undefined) {

                        for (let i = 0; i < id_modulo_web.length; i++) {
                            await db.query(`INSERT INTO sat_permisos_modulos_usuario(
                                id_usuario, id_modulo, cod_usu_ing, cod_usu_mod)
                                VALUES ($1, $2, $3, $4)`, [id_usuario, id_modulo_web[i], cod_usu_ing, cod_usu_mod]);
                        }
                    }
                }

                req.flash('warning', 'Registro actualizado correctamente');
                res.redirect('/api-sat/users-list');
            }
        });
    } catch (error) {
        log('src/controllers/front', 'users', 'usersAuthotization', error, false, req, res);
    }
};

let updateUsersAuthotization = async (req, res) => {
    const { id_usuario } = req.params;
    const { permiso_acceso_app, permiso_acceso_web, id_rol_permisos, id_modulo_app, id_modulo_web } = req.body;

    var acceso_app = permiso_acceso_app;
    var acceso_web = permiso_acceso_web

    if (acceso_app == 1) {
        if (id_modulo_app == undefined) {
            req.flash('delete', 'El Acceso APP fue permitido, pero ningún permiso fue asignado');
            return res.redirect(`/api-sat/users/${id_usuario}/edit-view`)
        }
    }else{
        acceso_app = 0;
    }

    if (acceso_web == 1) {
        if (id_modulo_web == undefined) {
            req.flash('delete', 'El Acceso WEB fue permitido, pero ningún permiso fue asignado');
            return res.redirect(`/api-sat/users/${id_usuario}/edit-view`)
        }
    }else{
        acceso_web = 0;
    }

    try {

        var localDate = new Date();
        var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
        var cod_usu = req.user.id_usuario;

        await db.query(`UPDATE sat_accesos_usuario
            SET permiso_acceso_app=$1, permiso_acceso_web=$2, id_rol_permisos=$3, fecha_mod_reg=$4, 
            cod_usu_ing=$5, cod_usu_mod=$6 WHERE id_usuario = $7 RETURNING *`, [acceso_app, acceso_web, id_rol_permisos, fecha_mod_reg, cod_usu, cod_usu, id_usuario], async (err, results) => {
            if (err) {
                log('src/controllers/front', 'users', 'usersAuthotization', err, false, req, res);
            } else {
                var userAccess = results.rows[0];

                //Actualizar permisos seleccionados
                if (userAccess.permiso_acceso_app != 0) {

                    var autorizacionAppModulsUser = await db.query(`SELECT pu.id_modulo
                        FROM sat_permisos_modulos_usuario AS pu
                        INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
                        WHERE pu.id_usuario = $1 AND m.tipo_modulo = 1`, [id_usuario]);
                    autorizacionAppModulsUser = autorizacionAppModulsUser.rows;

                    for (let i = 0; i < autorizacionAppModulsUser.length; i++) {
                        await db.query('DELETE FROM sat_permisos_modulos_usuario WHERE id_usuario =$1 AND id_modulo =$2', [id_usuario, autorizacionAppModulsUser[i].id_modulo]);
                    }

                    for (let i = 0; i < id_modulo_app.length; i++) {
    
                        await db.query(`INSERT INTO sat_permisos_modulos_usuario(
                                id_usuario, id_modulo, cod_usu_ing, cod_usu_mod)
                                VALUES ($1, $2, $3, $4)`, [id_usuario, id_modulo_app[i], cod_usu, cod_usu])
                    }

                } else {
                    //Obtiene la lista de modulos de la aplicacion. Alerta, atencion a crisis y dashboard.
                    var modulesApp = await db.query('SELECT id_modulo FROM sat_modulos WHERE tipo_modulo = 1');
                    modulesApp = modulesApp.rows;

                    for (let i = 0; i < modulesApp.length; i++) {
                        await db.query('DELETE FROM sat_permisos_modulos_usuario WHERE id_usuario =$1 AND id_modulo =$2', [id_usuario, modulesApp[i].id_modulo]);
                    }
                }

                //Actualizar permisos seleccionados
                if (userAccess.permiso_acceso_web != 0) {

                    var autorizacionWebModulsUser = await db.query(`SELECT pu.id_modulo
                        FROM sat_permisos_modulos_usuario AS pu
                        INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
                        WHERE pu.id_usuario = $1 AND m.tipo_modulo = 2`, [id_usuario]);
                    autorizacionWebModulsUser = autorizacionWebModulsUser.rows;

                    for (let i = 0; i < autorizacionWebModulsUser.length; i++) {
                        await db.query('DELETE FROM sat_permisos_modulos_usuario WHERE id_usuario =$1 AND id_modulo =$2', [id_usuario, autorizacionWebModulsUser[i].id_modulo]);
                    }

                    for (let i = 0; i < id_modulo_web.length; i++) {
       
                        await db.query(`INSERT INTO sat_permisos_modulos_usuario(
                            id_usuario, id_modulo, cod_usu_ing, cod_usu_mod)
                            VALUES ($1, $2, $3, $4)`, [id_usuario, id_modulo_web[i], cod_usu, cod_usu]);
                    }


                } else {
                    //Obtiene la lista de modulos de la aplicacion. Alerta, atencion a crisis y dashboard.
                    var modulesWeb = await db.query('SELECT id_modulo FROM sat_modulos WHERE tipo_modulo = 2 ORDER BY id_modulo ASC');
                    modulesWeb = modulesWeb.rows;

                    for (let i = 0; i < modulesWeb.length; i++) {
                        await db.query('DELETE FROM sat_permisos_modulos_usuario WHERE id_usuario =$1 AND id_modulo =$2', [id_usuario, modulesWeb[i].id_modulo]);
                    }
                }

                req.flash('warning', 'Registro actualizado correctamente');
                res.redirect('/api-sat/users-list');
            }
        });
    } catch (error) {
        log('src/controllers/front', 'users', 'updateUsersAuthotization', error, false, req, res);
    }
};

let userProfile = async (req, res) => {
    try {
        return res.render('users/users_profile');        
    } catch (error) {
        log('src/controllers/front', 'users', 'userProfile', error, false, req, res); 
    }

};


module.exports = {
    usersList,
    getById,
    usersAuthotization,
    updateUsersAuthotization,
    userProfile
}