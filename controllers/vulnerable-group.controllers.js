const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let vulnerableGroupList = async(req, res) => {

    try {
        var errorResponse = new ErrorModel({ type: "Group-Vulnerable", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de grupos vulnerables.", instance: "vulnerable_groups/vulnerableGroupList" });

        await db.query(`SELECT id_grp_vulnerable, descripcion
        FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var vulnerableGroup = results.rows;
                return res.status(200).json({ vulnerableGroup });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'vulnerable-group', 'vulnerableGroupList', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
};



module.exports = {
    vulnerableGroupList
}
