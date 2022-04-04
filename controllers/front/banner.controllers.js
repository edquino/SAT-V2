const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let bannerList = async(req, res) =>{
    try {

        let bannerExist = await db.query('SELECT COUNT(id_banner) AS banner FROM sat_banner');
        bannerExist = bannerExist.rows[0].banner;

        await db.query(`SELECT id_banner, titulo_banner, descripcion, url, estado
        FROM sat_banner`,(err,results)=>{
            if(err){
                log('src/controllers/front', 'banner', 'BannerList', err, false, req, res);
            }else{
                var banner = results.rows[0];
                return res.render('banner/banner_list', {banner, bannerExist});
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'banner', 'bannerList', error, false, req, res);
    }
};

let viewCreateBanner = async(req, res)=>{
    return res.render('banner/banner_create');
};

let createBanner = async (req, res) => {
    const { titulo_banner, descripcion, estado} = req.body;

    try {

        var photo;
        var photoRoute = null;
    
        var cod_usu_ing = req.user.id_usuario;
        var cod_usu_mod = req.user.id_usuario;

        if (req.files[0] != undefined) {
            photo = req.files[0].filename;
            photoRoute = '/uploads/' + photo;
        }

        await db.query(`INSERT INTO sat_banner(titulo_banner, descripcion, url, cod_usu_ing, cod_usu_mod, estado)
        VALUES ($1, $2, $3, $4, $5, $6)`, [titulo_banner, descripcion, photoRoute, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'banner', 'createBanner', err, false, req, res);
            } else {
                req.flash('success', 'Registro creada correctamente');
                return res.redirect('/api-sat/banner-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'banner', 'createBanner', error, false, req, res);
    }
};

let getById = async(req, res)=>{
    const {id_banner} = req.params;

    try {
        await db.query(`SELECT id_banner, titulo_banner, descripcion, url, estado
        FROM sat_banner WHERE id_banner = $1`,[id_banner],(err,results)=>{
            if(err){
                log('src/controllers/front', 'banner', 'getById', err, false, req, res);
            }else{
                var banner = results.rows[0];
                return res.render('banner/banner_edit', {banner});
            }
        });
    } catch (error) {
        log('src/controllers/front', 'banner', 'getById', error, false, req, res);
    }
};

let updateBanner = async(req, res) =>{
    const {id_banner} = req.params;
    const {titulo_banner, descripcion, estado} = req.body;

    try {
   
        var localDate =  new Date();
        var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
        var cod_usu_ing = req.user.id_usuario;
        var cod_usu_mod = req.user.id_usuario;

        await db.query(`UPDATE sat_banner
        SET titulo_banner=$1, descripcion=$2, fecha_mod_reg=$3, cod_usu_ing=$4, cod_usu_mod=$5, estado=$6
        WHERE id_banner=$7`, [titulo_banner, descripcion, fecha_mod_reg, cod_usu_ing, cod_usu_mod, estado, id_banner], (err, results)=>{
            if(err){
                log('src/controllers/front', 'banner', 'updateBanner', err, false, req, res);
            }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/banner-list');
            }
        });
       
    } catch (error) {
        log('src/controllers/front', 'banner', 'updateBanner', error, false, req, res);

    }
};

let updatePhotoBanner = async(req, res) =>{
    const {id_banner} = req.params;
    try {
   
        if (req.files[0] != undefined) {
            photo = req.files[0].filename;
            photoRoute = '/uploads/' + photo;

            var localDate = new Date();
            var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
            var cod_usu_ing = req.user.id_usuario;
            var cod_usu_mod = req.user.id_usuario;

            await db.query(`UPDATE sat_banner
                SET  url=$1, fecha_mod_reg=$2, cod_usu_ing=$3, cod_usu_mod=$4
                WHERE id_banner=$5`, [photoRoute, fecha_mod_reg, cod_usu_ing, cod_usu_mod, id_banner], (err, results) => {
                if (err) {
                    log('src/controllers/front', 'banner', 'updatePhotoBanner', err, false, req, res);
                } else {
                    req.flash('warning', 'Registro actualizado correctamente');
                    return res.redirect('/api-sat/banner-list');
                }
            });
        } else {
            req.flash('delete', 'No se selecciona ninguna imagen');
            return res.redirect(`/api-sat/banner/${id_banner}/view-update`)
        }

    } catch (error) {
        log('src/controllers/front', 'banner', 'updatePhotoBanner', error, false, req, res);

    }
};

module.exports = {
    bannerList,
    viewCreateBanner,
    createBanner,
    getById,
    updateBanner,
    updatePhotoBanner
}