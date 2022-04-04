const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');
const md5 = require('md5');
const jwt = require('jsonwebtoken');


const login = async (req, res) => {
    const { user, password, fcm_token} = req.body;

    var errorResponse = new ErrorModel({ type: "Users-Auth", title:"Falló la función", status:401, detail:"Lo sentimos ocurrió un error al intentar iniciar sesión.", instance:"users.auth/login" });

    try {

        await db.query(
        /*`SELECT u.id_usuario AS user_id, CONCAT(u.nombre,' ', u.apellido) AS name, u.usuario AS user_name, 
        up.descripcion AS position, u.correo AS email, u.genero AS gender, u.clave,
        json_agg( DISTINCT jsonb_build_object('role_id', pp.id_rol_permisos, 'name', pp.nombre_permiso)) AS roles,
        json_agg( DISTINCT jsonb_build_object('module_id', m.id_modulo, 'name', m.nombre_modulo)) AS modules
        FROM usuario AS u
        INNER JOIN perfil AS up ON up.id_perfil = u.id_perfil
        INNER JOIN sat_accesos_usuario AS ac ON u.id_usuario = ac.id_usuario
        INNER JOIN sat_rol_app_permisos AS pp ON pp.id_rol_permisos = ac.id_rol_permisos
        INNER JOIN sat_permisos_modulos_usuario AS mu ON u.id_usuario = mu.id_usuario
        INNER JOIN sat_modulos AS m ON m.id_modulo = mu.id_modulo
        WHERE u.usuario = $1 AND u.estado_reg = 'A' AND ac.permiso_acceso_app = 1 AND m.tipo_modulo = 1
        GROUP BY user_id, name, user_name, position, email, gender, clave`*/

        `SELECT u.id_usuario AS user_id, CONCAT(u.nombre,' ', u.apellido) AS name, u.usuario AS user_name, 
        u.correo_electronico AS email, u.clave, u.id_ins_usuario, u.id_depto_usuario, u.id_car_usuario, d.codigo,
        json_agg( DISTINCT jsonb_build_object('role_id', pp.id_rol_permisos, 'name', pp.nombre_permiso)) AS roles,
        json_agg( DISTINCT jsonb_build_object('module_id', m.id_modulo, 'name', m.nombre_modulo)) AS modules
        FROM segd_usuario AS u
        INNER JOIN sat_accesos_usuario AS ac ON u.id_usuario = ac.id_usuario
        INNER JOIN sat_rol_app_permisos AS pp ON pp.id_rol_permisos = ac.id_rol_permisos
        INNER JOIN sat_permisos_modulos_usuario AS mu ON u.id_usuario = mu.id_usuario
        INNER JOIN sat_modulos AS m ON m.id_modulo = mu.id_modulo
        INNER JOIN admi_departamento as d ON d.id_departamento = u.id_depto_usuario
        WHERE u.usuario = $1 AND u.est_reg = 'A' AND ac.permiso_acceso_app = 1 AND m.tipo_modulo = 1
        GROUP BY user_id, name, user_name, email, u.id_ins_usuario, clave, codigo, u.id_depto_usuario, u.id_car_usuario`
        , 
        [user], async(err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
                
            }

            if (results.rowCount > 0) {

                var userPassword = md5(password);

                if (userPassword != results.rows[0].clave) {
                    errorResponse.title = "Datos incorrectos";
                    errorResponse.detail = 'Correo o contraseña invalido';
                    return res.status(401).json(errorResponse.toJson());
                }

                var user = results.rows[0];
                var userToken = await db.query(`SELECT token FROM sat_seguridad_token WHERE id_usuario = $1`, [user.user_id]);
                userToken = userToken.rows[0];
 
                if (userToken != undefined) {
                    if(userToken.token != fcm_token){
                        db.query('UPDATE sat_seguridad_token SET token= $1 WHERE id_seguridad_token=$2', [fcm_token, user.user_id]);
                    }
                }else {
                    db.query('INSERT INTO sat_seguridad_token(id_usuario, token) VALUES ($1, $2)', [user.user_id, fcm_token]);
                }
                
                let token = jwt.sign({ user }, process.env.SEED, { expiresIn: Number(process.env.CADUCIDAD_TOKEN) });

                return res.status(200).json({
                    user,
                    token
                    //expiresIn: Number(process.env.CADUCIDAD_TOKEN)
                });
            }
            else {
                errorResponse.title = "Datos incorrectos";
                    errorResponse.detail = 'Correo o contraseña invalido';
                return res.status(401).json(errorResponse.toJson());
            }

        });
    } catch (error) {
        console.log(error);
        log('src/controllers/back', 'users.auth', 'login', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
};


const refreshToken = (req, res) => {
    const { token } = req.body;

    var errorResponse = new ErrorModel({ type: "Auth", title:"Falló la función", status:400, detail:"Lo sentimos no pudimos renovar su sesión.", instance:"auth/refreshToken" });

    if (!token) {
        errorResponse.detail = 'El token de sesión no fue enviado.';
        return res.status(400).json(errorResponse.toJson());
    }

    try {

        jwt.verify(token, process.env.SEED);

        var decodedToken = jwt.decode(token);
        var user = decodedToken.user;


        const newToken = jwt.sign({ user }, process.env.SEED, { expiresIn: Number(process.env.CADUCIDAD_TOKEN) })

        return res.status(200).json({ token: newToken });


    } catch (error) {
        console.log(error);
        return res.status(400).json(errorResponse.toJson());

    }


}

const profile = async (req,res) => {

    
    var errorResponse = new ErrorModel({ type: "Users-Auth", title:"Falló la función", status:401, detail:"Lo sentimos ocurrió un error al intentar iniciar sesión.", instance:"users.auth/login" });

    try {

        await db.query(
        /*`SELECT u.id_usuario AS user_id, CONCAT(u.nombre,' ', u.apellido) AS name, u.usuario AS user_name, 
        up.descripcion AS position, u.correo AS email, u.genero AS gender, u.clave,
        json_agg( DISTINCT jsonb_build_object('role_id', pp.id_rol_permisos, 'name', pp.nombre_permiso)) AS roles,
        json_agg( DISTINCT jsonb_build_object('module_id', m.id_modulo, 'name', m.nombre_modulo)) AS modules
        FROM usuario AS u
        INNER JOIN perfil AS up ON up.id_perfil = u.id_perfil
        INNER JOIN sat_accesos_usuario AS ac ON u.id_usuario = ac.id_usuario
        INNER JOIN sat_rol_app_permisos AS pp ON pp.id_rol_permisos = ac.id_rol_permisos
        INNER JOIN sat_permisos_modulos_usuario AS mu ON u.id_usuario = mu.id_usuario
        INNER JOIN sat_modulos AS m ON m.id_modulo = mu.id_modulo
        WHERE u.correo = $1 AND u.estado_reg = 'A' AND ac.permiso_acceso_app = 1 AND m.tipo_modulo = 1
        GROUP BY user_id, name, user_name, position, email, gender, clave`*/

        `SELECT u.id_usuario AS user_id, CONCAT(u.nombre,' ', u.apellido) AS name, u.usuario AS user_name, 
        u.correo_electronico AS email, u.clave,
        json_agg( DISTINCT jsonb_build_object('role_id', pp.id_rol_permisos, 'name', pp.nombre_permiso)) AS roles,
        json_agg( DISTINCT jsonb_build_object('module_id', m.id_modulo, 'name', m.nombre_modulo)) AS modules
        FROM segd_usuario AS u
        INNER JOIN sat_accesos_usuario AS ac ON u.id_usuario = ac.id_usuario
        INNER JOIN sat_rol_app_permisos AS pp ON pp.id_rol_permisos = ac.id_rol_permisos
        INNER JOIN sat_permisos_modulos_usuario AS mu ON u.id_usuario = mu.id_usuario
        INNER JOIN sat_modulos AS m ON m.id_modulo = mu.id_modulo
        WHERE u.usuario = $1 AND u.est_reg = 'A' AND ac.permiso_acceso_app = 1 AND m.tipo_modulo = 1
        GROUP BY user_id, name, user_name, email, clave;`
        , 
        /*[req.user.email], (err, results) => {*/
        [req.user.id_usuario], (err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
                
            }
            var user = results.rows[0];

            return res.status(200).json({user});


        });
    } catch (error) {
        log('src/controllers/back', 'users.auth', 'profile', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
}



module.exports = {
    login,
    refreshToken,
    profile
}