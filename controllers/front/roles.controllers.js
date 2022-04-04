const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let rolesList = async(req, res) => {

    try {
        await db.query(`SELECT id_rol_permisos, nombre_permiso, estado 
        FROM sat_rol_app_permisos ORDER BY id_rol_permisos ASC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'roles', 'RolesList', err, false, req, res);
            }else{
                var rolesLList = results.rows;
                return res.render('roles/roles_list', { rolesLList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'roles', 'RolesList', error, false, req, res);
    }
};

let viewCreateRole = async(req, res)=>{
    return res.render('roles/roles_create');
};

let createRole = async (req, res) => {
    const { nombre_permiso, estado } = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_rol_app_permisos(
            nombre_permiso, cod_usu_ing, cod_usu_mod, estado)
            VALUES ( $1, $2, $3, $4)`, [nombre_permiso, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'roles', 'createRole', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/role-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'roles', 'createRole', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_rol_permisos } = req.params;
    try {
        await db.query(`SELECT id_rol_permisos, nombre_permiso, estado 
        FROM sat_rol_app_permisos WHERE id_rol_permisos = $1`,[id_rol_permisos], 
        (err, results)=>{
            if(err){
                log('src/controllers/front', 'roles', 'getById', err, false, req, res);
            }else{
                var role = results.rows[0];
                return res.render('roles/roles_edit', { role });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'roles', 'getById', error, false, req, res);
    }
};

let updateRole = async (req, res)=>{
    
    const { id_rol_permisos } = req.params;
    const { nombre_permiso, estado } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_rol_app_permisos
        SET nombre_permiso=$1, fecha_mod_reg=$2, cod_usu_ing=$3, cod_usu_mod=$4, estado=$5
        WHERE id_rol_permisos = $6`, [nombre_permiso, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_rol_permisos], (err, results)=>{
            if(err){
                log('src/controllers/front', 'roles', 'updateRole', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/role-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'roles', 'updateRole', error, false, req, res);
    }

};

module.exports = {
    rolesList,
    viewCreateRole, 
    createRole,
    getById,
    updateRole
}
