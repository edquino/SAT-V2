const LocalStrategy = require('passport-local').Strategy;
const md5 = require('md5');
const db = require('./db');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {

        done(null, user);
    });

    passport.deserializeUser(function (user, done) {

        done(null, user);
    });

    passport.use(
        'login-user',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
            async (req, user, password, done) => {

                db.query(
                   /* `SELECT u.id_usuario, u.usuario, u.nombre, u.apellido, u.usuario, u.fec_nacimiento, 
                    u.correo, u.usuario, u.clave, u.estado_reg, u.id_perfil, up.descripcion AS perfil, ac.permiso_acceso_web,
                    ac.id_rol_permisos
                    FROM usuario AS u
                    INNER JOIN perfil AS up ON up.id_perfil = u.id_perfil
                    INNER JOIN sat_accesos_usuario AS ac ON u.id_usuario = ac.id_usuario
                    WHERE u.usuario = $1 AND u.estado_reg = 'A' AND ac.permiso_acceso_web = 1`*/

                    `SELECT u.id_usuario, u.usuario, u.nombre, u.apellido, u.usuario, u.fec_nacimiento, 
                    u.correo_electronico, u.usuario, u.clave, u.est_reg, u.id_usuario AS id_perfil, ac.permiso_acceso_web,
                    ac.id_rol_permisos, u.id_ins_usuario, d.codigo
                    FROM segd_usuario AS u
                    INNER JOIN sat_accesos_usuario AS ac ON u.id_usuario = ac.id_usuario
                    INNER JOIN admi_departamento as d ON d.id_departamento = u.id_depto_usuario
                    WHERE u.usuario = $1 AND u.est_reg = 'A' AND ac.permiso_acceso_web = 1`, [user], async (err, results) => {
                    if (err) {
                        console.log(err.stack);
                        return done(null, false, req.flash('error', err.stack));
                    } else {
                        
                        console.log('resultado de la consulta: ', results.rows.length);

                        if (!results.rows.length) {
                            return done(null, false, req.flash('warning', 'Usuario o contraseña incorrectos'));
                        } else {

                            var userPassword = md5(password);

                            if (userPassword != results.rows[0].clave) {
                                console.log('despues entro al error');
                                return done(null, false, req.flash('warning', 'Usuario o contraseña incorrectos'));
                            } else {    

                                let user = results.rows[0];

                                user.administracion = 0;
                                user.cat = 0;
                                user.dashboard = 0;
                                user.alert = 0;
                                user.role = user.id_rol_permisos;

                                
                                if (results.rows.length > 0) {

                                    var authorizationModuls = await db.query(`SELECT mu.id_modulo::numeric AS id_modulo, m.nombre_modulo  
                                    FROM sat_permisos_modulos_usuario AS mu 
                                    INNER JOIN sat_modulos AS m ON mu.id_modulo = m.id_modulo 
                                    WHERE mu.id_usuario = $1 AND m.tipo_modulo = 2`, [user.id_usuario]);
                                    authorizationModuls = authorizationModuls.rows;

                                    //if (authorizationModuls != undefined && user.id_perfil != 1) {
                                    if (authorizationModuls != undefined) {
                                        for (let i = 0; i < authorizationModuls.length; i++) {
                                            if (authorizationModuls[i].id_modulo == 4) {
                                                user.administracion = 1;
                                            } else if (authorizationModuls[i].id_modulo == 5) {
                                                user.cat = 1;
                                            } else if (authorizationModuls[i].id_modulo == 6) {
                                                user.dashboard = 1;
                                            } else if (authorizationModuls[i].id_modulo == 8) {
                                                user.alert = 1;
                                            } 
                                            
                                        }
                                    }
    
                                }
                                console.log(user);
                                return done(null, user, null);
                            }
                        }
                    }
                });
            })
    );
};
