const express = require('express');
const mongoose = require('mongoose');
const Shirt = mongoose.model('Shirt');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/', (req, res) => {
    res.render("shirt/addOrEdit", {
        viewTitle: "Insert Shirt"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
    insertRecord(req, res);
    else
    updateRecord(req, res);     
});

function insertRecord(req, res) {
        var shirt = new Shirt ();
        shirt.shirtName = req.body.shirtName;
        shirt.shirtColor = req.body.shirtColor;
        shirt.shirtSize = req.body.shirtSize;
        shirt.save((err, doc) => {
            if (!err)
            res.redirect('shirt/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("shirt/addOrEdit", {
                    viewTitle: "Insert Shirt",
                    shirt: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
    }
    
    function updateRecord(req, res) {
        Shirt.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
            if (!err) { res.redirect('shirt/list'); }
            else {
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body); 
                    res.render("shirt/addOrEdit", {
                        viewTitle: 'Update Shirt',
                        shirt: req.body
                    });
                }
                else
                    console.log('Error during record update : ' + err);
            }
        });
    }
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ShirtDB");
        dbo.collection("shirts").find({}).toArray(function(err, result) {
          if (err) throw err;
          
          router.get('/list', (req, res) => {
                res.render ("shirt/list", {
                    list : result
                });
    });
          db.close();
        });
      });
    
    
    function handleValidationError(err, body) {
        for (field in err.errors) {
            switch (err.errors[field].path) {
                case 'shirtName':
                    body['shirtNameError'] = err.errors[field].message;
                    break;
                case 'shirtColor':
                    body['shirtColorError'] = err.errors[field].message;
                    break;
                case 'shirtSize':
                    body['shirtSizeError'] = err.errors[field].message;
                default:
                    break;
            }
        }
    }
    
    router.get('/:id', (req, res) => {
         Shirt.findById(req.params.id, (err, doc) => {
             if (!err) {
                 res.render("shirt/addOrEdit", {
                     viewTitle: "Update Shirt",
                     shirt: doc
                 });
             }
         });
    });
    
    router.get('/delete/:id', (req, res) => {
        Shirt.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) {
                res.redirect('/shirt/list');
            }
            else { console.log('Error in shirt delete :' + err); }
        });
    });    


module.exports = router;