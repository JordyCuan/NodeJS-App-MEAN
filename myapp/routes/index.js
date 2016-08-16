var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var controller = require('../controllers/mis_controllers')

router.get('/users/raw_list', controller.raw_users_list);
router.get('/users/bulk_add', controller.bulk_add);



sleep = function (milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 10e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


router.get('/rest', function (req, res) {
	res.send("Peticion GET");
});
router.post('/rest', function (req, res) {
	res.send("Peticion POST");
});
router.put('/rest', function (req, res) {
	res.send("Peticion PUT");
});
router.delete('/rest', function (req, res) {
	res.send("Peticion DELETE");
});


router.get('/archivo', function (req, res) {
	console.log(__dirname);
	fs.readFile('./public/mis_paginas_estaticas/hello_estatico.html',function (err, data) {
		if (err) {
			console.log(err);
			res.writeHead(404, {'Content-Type': 'text/html'});
		}else{   
			res.writeHead(200, {'Content-Type': 'text/html'});  
			res.write(data.toString());    
		}
		res.end();
	}); 
});


module.exports = router;
