const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');



let upload = async (req, res) => {

    var errorResponse = new ErrorModel({ type: "Upload Image", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar guardar la imagen en el servidor.", instance: "uploadImage/upload" });

    try {
        if (req.file != undefined) {

            var path = req.file.path.split('public')[1];
            return res.status(201).json({ "path": path});

        } else {
            errorResponse.detail = "No se envio ningun archivo.";
            return res.status(500).json(errorResponse.toJson());
        }
    } catch (error) {
        log('src/controllers/back', 'uploadImage', 'upload', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }





}


module.exports = {
    upload
}