const jwt = require('jsonwebtoken');
const db = require('@config/db');


let usersTokenVerification = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(500).json({
                error: err.stack
            });
        }


        if(decoded.user == undefined){
            return res.status(404).json({
                error: 'User not found'
            });
        }
        
        var user = decoded.user;

        //db.query(`SELECT * FROM usuario WHERE correo = $1 AND estado_reg = 'A'`, [user.email], (err, results) => {
        db.query(`SELECT * FROM segd_usuario WHERE usuario = $1 AND est_reg = 'A'`, [user.user_name], (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: err.stack
                });
            }

            if (results.rowCount <= 0) {
                return res.status(404).json({
                    error: 'User not found.'
                });
            }

            req.user = user;
            
            next();
        });


    })

};

let clientsTokenVerification = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if(decoded.user == undefined){
            return res.status(400).json({
                error: 'User not found'
            });
        }
         
        var client = decoded.user;

        req.user = client;
            
        next();


    })

};


module.exports = {
    usersTokenVerification,
    clientsTokenVerification
};
