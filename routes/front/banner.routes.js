const { Router } = require('express');
const router = Router();

const multer = require("multer")
const path = require("path");

const { isLoggedIn } = require('@middlewares/auth');
const { bannerList, viewCreateBanner, createBanner, getById, updateBanner, updatePhotoBanner} = require('@controllers/front/banner.controllers');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/uploads"))
    },
    filename: function (req, file, cb) {
        fileExtension = file.originalname.split(".")[1]
        cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension)
    },
});

var upload = multer({ storage: storage });

// get source list
router.get('/api-sat/banner-list', isLoggedIn, bannerList);

router.get('/api-sat/banner/create-view', isLoggedIn, viewCreateBanner);
router.post('/api-sat/banner/create', isLoggedIn, upload.array("file", 1), createBanner);

router.get('/api-sat/banner/:id_banner/view-update', isLoggedIn, getById);
router.post('/api-sat/banner/:id_banner/update', isLoggedIn, updateBanner);

router.post('/api-sat/banner/:id_banner/photo-update', isLoggedIn, upload.array("file", 1), updatePhotoBanner);

module.exports = router;

