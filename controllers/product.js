var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Product = require('../models/product');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, xcallback) {
        xcallback(null, 'public/images');
    },
    filename: function (req, file, xcallback) {
        xcallback(null, file.originalname);
    }
});
var uploadStore = multer({ storage: storage });

const dbname = 'newshop';
const uri = 'mongodb://localhost:27017/' + dbname;

/// --- Code CONTROLLERs
router.use(function timeLog (req, res, next) {
    console.log('\n\t Product controller - Time: ', Date.now());
    next();
})

/// ..................................................
router.get('/', productPage);
function productPage(req, res) {
    res.send('PRODUCT: home page');
}

/// ..................................................
router.get('/list', listProductPage);
function listProductPage(req, res) {
    res.send('PRODUCT: list PRODUCT page');
}

/// ..................................................
router.post('/create', uploadStore.array('img', 12),  createProductPage);
router.get('/create', uploadStore.array('img', 12), createProductPage);
function createProductPage(req, res, next) {
    xproduct = {
        id: "",
        name: "",
        price: 0,
        information: "",
        img: ""
    };
    if (req.body.id) {
        xproduct.id = req.body.id;
    }
    if (req.body.name) {
        xproduct.name = req.body.name;
    }
    if (req.body.price) {
        xproduct.price = req.body.price;
    }
    if (req.body.information) {
        xproduct.information = req.body.information;
    }
    if (req.files) {
        xproduct.img = req.files[0].originalname;
    }

    console.log(xproduct);

    if (xproduct.id != "") {
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },
            function(err, dbconnection) {
                if (err) throw handleError(err);
                ///
                console.log('\n\t insert Product: Successfully connected');
        
                ///
                const newproduct = new Product( {
                    _id : new mongoose.Types.ObjectId, 
                    id : xproduct.id,
                    name: xproduct.name,
                    price: xproduct.price,
                    information: xproduct.information,
                    img: xproduct.img
                });
                newproduct.save( function(err) {
                    if (err) throw err;
                    ///
                    console.log('\n\t insert - Product model - Successfully insert');
                } );  
        });
    }

    res.render("pages/product_create", {title: "ATN-Shop create PRODUCT page", Notify: "", configHeader: router.params.configHeader , currpage: "create Product" });
}


/// --- EXports
module.exports = router;


