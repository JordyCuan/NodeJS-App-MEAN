var express = require('express');
var router = express.Router();
var fs = require('fs');

var multer  = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log('*-*-*-*-*-*-*-*-*',__dirname,req.user._email);

		var newDestination = 'uploads/' + req.user._email;
		var stat = null;
		try {
			stat = fs.statSync(newDestination);
		} catch (err) {
			fs.mkdirSync(newDestination);
		}
		if (stat && !stat.isDirectory()) {
			throw new Error('---Directory cannot be created because an inode of a different type exists at "' + dest + '"');
		}		
		cb(null, newDestination);
	}
});

var upload = multer(
	{ 
		dest: 'uploads/',
		limits: {
			fieldNameSize: 100,
			fileSize: 60000000
		},
		storage: storage
	}
);




// AUTENTICACION CON PASSPORT
var isAuthenticated = function (req, res, next) {// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();

	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login'); // TODO - Si va a ser un servicio web, se deberían de settear errores y mensajes aquí.
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


var controladores = require('../controllers/controladores')


router.post('/user/add', controladores.add);
router.get('/user/list', controladores.user_list);


// Archivos por usuario
router.get('/user/files', isAuthenticated, function (req, res) {
	res.json(req.user._objs); // Devolver sus archivos asociados
});


// POST Subir archivo
router.use("/upload", isAuthenticated);
router.use("/upload", upload.single("obj"));
router.post('/upload', controladores.upload_file);
// https://github.com/expressjs/multer/issues/58#issuecomment-75315556
// http://stackoverflow.com/questions/25698176/how-to-set-different-destinations-in-nodejs-using-multer




// Calling a binary
router.get("/binary", function (req, res) {
	const spawn = require('child_process').spawn;
	const comando = spawn('ls', ['-lh', '/usr']);

	comando.stdout.setEncoding('utf8');
	comando.stderr.setEncoding('utf8');

	comando.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
		res.write("\n\nstdout: " + data);
	});

	comando.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
		res.write("\n\nstderr: " + JSON.stringify(data));
	});

	comando.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		res.write("\n\nchild process exited with code " + JSON.stringify(code));

		res.end();
	});
});



// Binario de Itzel
router.get("/decimar", function (req, res) {
	console.log(__dirname);
	var path = "/home/jordy/node_projects/myapp/binarios/" + "decimacion";

	var obj_name = "city.obj";
  	var fileName = "/home/jordy/node_projects/myapp/uploads/jordy@hotmail.com/" + obj_name;
	var newDestination = "/home/jordy/node_projects/myapp/uploads/jordy@hotmail.com/decimar/";
	var stat = null;

	try {
		stat = fs.statSync(newDestination);
	} catch (err) {
		fs.mkdirSync(newDestination);
	}
	if (stat && !stat.isDirectory()) {
		throw new Error('---Directory cannot be created because an inode of a different type exists at "' + dest + '"');
	}
	
	origen = fileName;
	destino = newDestination + obj_name;
	porcentaje = 50;

	const spawn = require('child_process').spawn;
	const comando = spawn(path, [origen, destino, 50]);

	res.write("Programa: " + path + "\n\n");
	res.write("origen: " + origen + "\n\n");
	res.write("destino: " + destino + "\n\n");
	res.write("porcentaje: " + porcentaje + "\n\n");

	comando.stdout.setEncoding('utf8');
	comando.stderr.setEncoding('utf8');

	comando.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
		res.write("\n\nstdout: " + data);
	});

	comando.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
		res.write("\n\nstderr: " + JSON.stringify(data));
	});

	comando.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		res.write("\n\nchild process exited with code " + JSON.stringify(code));

		res.end();
	});
});




router.get('/fileobj', function (req, res) {
	var uploads = "/home/jordy/node_projects/myapp/uploads/";
	var _email  = "jordy@hotmail.com";
	var _obj    = "dancer03.obj"

	console.log(__dirname);
  	//var fileName = "/home/jordy/node_projects/myapp/uploads/jordy@hotmail.com/city.obj";
	var fileName = uploads + _email + "/" + _obj;


	var options = {
    	headers: {
        	'x-timestamp': Date.now(),
        	'x-sent': true,
        	'mimetype': "application/octet-stream",
        	'Content-Type' : "application/octet-stream"
    	}
  	};

	console.log(fileName);
  	res.sendFile(fileName, options, function (err) {
    	if (err) {
      		console.log(err);
      		res.status(err.status).end();
    	}
    	else {
      		console.log('Sent:', fileName);
    	}
  	});
});











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


router.post('/rest', multer(
	{ 
		dest: 'uploads/',
		limits: {
			fieldNameSize: 100,
			fileSize: 60000000
		}
	}).single("obj"), function (req, res) {
	if (req.file) {
		res.json(req.file);
		console.log(req.file);
	}
	else {
		res.write("Respuesta de Peticion POST\n\n");
		params = req.body;
		console.log(req.body);
		console.log('\n\n')
		//console.log(req.body.request.slice[0].origin);

		for (p in params) {
			res.write(p + "\t\t" + params[p] + "\n");
		}
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
router.get("/uploadfile", function(req, res) {
	console.log(__dirname);
	fs.readFile('./public/pages/UploadFile.html',function (err, data) {
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


router.get("/uploadfile-js", function(req, res) {
	console.log(__dirname);
	fs.readFile('./public/pages/UploadFile-JS.html',function (err, data) {
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



router.get('/angularJSON', function (req, res) {
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
	obj = [ {"id": 1,"name": "Walter", "surname": "White"},  {"id": 2,"name": "Jesse", "surname": "Pinkman"},
			{"id": 3,"name": "Jordy", "surname": "Cuan"},  {"id": 4,"name": "Pedro", "surname": "Pérez"} ]
	res.json(obj);
});

router.get('/static-index', function (req, res) {
	console.log(__dirname);
	fs.readFile('./public/static-index.html',function (err, data) {
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
	//failureRedirect: '/login',
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
