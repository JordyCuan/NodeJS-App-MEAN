var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var controller = require('../controllers/mis_controllers');
var controladores = require('../controllers/controladores')

router.get('/users/raw_list', controller.raw_users_list);
router.get('/users/bulk_add', controller.bulk_add);




router.post('/user/add', controladores.add);
router.get('/user/list', controladores.user_list);






sleep = function (milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 10e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
        break;
    }
  }
}




//req.params	- /element/:id/
//req.body		- /element/
//req.query		- /element?id=valor

router.get('/rest', function (req, res) {
	res.write("Respuesta de Peticion GET\n");
	params = req.query;

	for (p in params) {
		res.write(p + "\t\t" + params[p] + "\n");
	}
	res.end();
});


router.post('/rest', function (req, res) {
	res.write("Respuesta de Peticion POST\n\n");
	params = req.body;
	console.log(req.body);
	console.log('\n\n')
	//console.log(req.body.request.slice[0].origin);

	for (p in params) {
		res.write(p + "\t\t" + params[p] + "\n");
	}

	res.end();
});


router.put('/rest', function (req, res) {
	res.send("Peticion PUT");
});
router.delete('/rest', function (req, res) {
	res.send("Peticion DELETE");
});




router.get('/archivo', function (req, res) {
	console.log(__dirname);
	fs.readFile('./public/pages/hello_estatico.html',function (err, data) {
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
