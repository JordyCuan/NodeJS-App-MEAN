var express = require('express');
var router = express.Router();
var fs = require('fs');


// AUTENTICACION CON PASSPORT
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();

	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}




sleep = function (milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 10e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
        break;
    }
  }
}





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




/************************************************************************************************/
/************************************************************************************************/
//     PAGINAS ESTÁTICAS
/************************************************************************************************/
/************************************************************************************************/

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


router.get('/angular', isAuthenticated, function (req, res) {
	console.log(__dirname);
	fs.readFile('./public/pages/angular.html',function (err, data) {
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


router.get('/angular2', isAuthenticated, function (req, res) {
	console.log(__dirname);
	fs.readFile('./public/pages/angular2.html',function (err, data) {
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



router.get('/angularJSON', isAuthenticated, function (req, res) {
	console.log(__dirname);
	fs.readFile('./public/pages/angularAPI.html',function (err, data) {
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


router.get('/json', function (req, res) {
	obj = [ {"id": 1,"name": "Walter", "surname": "White"},  {"id": 2,"name": "Jesse", "surname": "Pinkman"} ]
	res.json(obj);
});








/************************************************************************************************/
/************************************************************************************************/
//     PASSPORT
/************************************************************************************************/
/************************************************************************************************/
var passport = require('passport');

/* GET login page. */
router.get('/login', function(req, res) {
	// Display the Login page with any flash message, if any
	res.render('login', { message: req.flash('Revisa los campos y vuelve a intentarlo') });
});

/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
	successRedirect: '/home',
	failureRedirect: '/login',
	failureFlash : true  
}));



/* GET Registration Page */
router.get('/signup', function(req, res){
	res.render('signup', { /* message: req.flash('message') */ });
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
	successRedirect: '/home',
	failureRedirect: '/signup',
	failureFlash : true  
}));


/* Handle Logout */
router.get('/signout', function(req, res) {
	req.logout();
	res.redirect('/');
});





// ******* Esta es una pagina protegida ********
/* GET Home Page */
router.get('/home', isAuthenticated, function(req, res){
	console.log(req.user)
	res.render('home', { user: req.user });
});





module.exports = router;
