const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let bannerList = async(req, res) =>{
    try {

        var errorResponse = new ErrorModel({ type: "Conflict Situation", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la información del Banner.", instance: "banner/bannerList" });

        await db.query(`SELECT id_banner::integer AS id, titulo_banner AS title, descripcion AS body, url
        FROM sat_banner WHERE estado = 1`,(err,results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var bannerList = results.rows;
                return res.status(200).json({ bannerList });
            }
        });   
    } catch (error) {
        return res.status(500).json(errorResponse.toJson());
    }
};



module.exports = {
    bannerList
}