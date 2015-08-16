var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');


router.post('/rest/sign', function(req, res) {
    
    var db = req.db;
    var users = db.get('userlist');
    users.findOne({ username: req.body.username }).on('success', function (doc) {

        var token = jwt.sign({"username": req.body.username,"password":req.body.password}, 'shhhhh');
    
        res.status(200);
        res.json({ 
            message: 'Usuario autenticado correctamente' 
        }); 
});



router.get('/api200', function(req, res) {
    
    res.status(200);
    res.json({ message: 'API Security Tokenc2' }); 
    
});

router.get('/api403', function(req, res) {
    
    res.status(403);
    res.json({ message: 'API Security Token' }); 
 
});

router.get('/api500', function(req, res) {
    res.status(500).send({ error: "boo:(" });
    res.json({ message: 'API Security Token' }); 
  
});


/* GET home page. */
router.get('/', function(req, res, next) {

  var usuarios = "";
  var db = req.db;

  var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
       //res.json(docs);

        res.render('index',
            {
                title: 'Express',
                usuarios: JSON.stringify(docs)

            });


    });



});


/* GET home page. */
router.post('/sign', function(req, res, next) {

    var db = req.db;
    var users = db.get('userlist');
    users.findOne({ username: req.body.username }).on('success', function (doc) {

        var token = jwt.sign({"sub": "45478153","username": req.body.username}, 'shhhhh');

        res.render('index',
            { title: 'Express',
                jwt:token,
                user:JSON.stringify(doc)});

    });


});


router.post('/decode', function(req, res, next) {

    var token = req.body.token;

    //var decoded = jwt.decode(token);

    // get the decoded payload and header
    var decoded = jwt.decode(token, {complete: true});

    res.render('index',
        {   title: 'Express',
            header:JSON.stringify(decoded.header),
            payload:JSON.stringify(decoded.payload)
        });


});


router.post('/create', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');

    collection.insert({ id: req.body.id, username: req.body.username ,password:req.body.password });

    res.render('index', { title: 'Usuario creado'+req.body.username });

});


module.exports = router;
