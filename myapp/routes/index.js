var path = require('path');
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
		fileFilter: function (req, file, cb) {
		    if (!file.originalname.match(/\.(obj)$/)) {
		    //if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		        return cb(new Error('Only OBJ files are allowed!'));
		    }
		    cb(null, true);
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
//	res.status(304)        // HTTP status 304: NotLogged
//    	.send('Not found');
}


var authEndPoint = function (req, res, next) {
	if (req.isAuthenticated()) return next();

	res.status(304).send('Not Authenticated. Log in first');
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


var controladores = require('../controllers/controladores')


router.post('/user/add', controladores.add);
router.get('/user/list', controladores.user_list);


// Archivos por usuario
router.get('/user/files', authEndPoint, function (req, res) {
	var Obj  = require('../models/archivos_obj');

	var result = Obj.find({'_id': { $in: req.user._objs}}, function(err, docs){
		if (err){
			console.log(err);
		} 
		else {
			res.json(docs);
		}
	});
});


// POST Subir archivo
router.use("/upload", authEndPoint);
router.use("/upload", upload.single("obj"));
router.post('/upload', controladores.upload_file);
// https://github.com/expressjs/multer/issues/58#issuecomment-75315556
// http://stackoverflow.com/questions/25698176/how-to-set-different-destinations-in-nodejs-using-multer



// Binario de Itzel
router.post("/decimar", authEndPoint, function (req, res) {
	var exe = "/home/jordy/node_projects/myapp/binarios/" + "decimacion"; // TODO - Debe ser un path relativo, no absoluto
	var uploads_path = "/home/jordy/node_projects/myapp/uploads/"; // TODO - Implementar el uso de la funcion path para hacer join y evitar concatenar

	var resultado = {
		codigo : 1 // 1 : Error
	};

	if (! req.body) {
		console.log("No hay FORM-DATA");
		res.json(resultado);
		return;
	}
	if (! req.body.obj || ! req.body.porcentaje) {
		console.log("Falto algún parametro para realizar la decimación");
		res.json(resultado);
		return;
	}

	var obj_name = req.body.obj;
  	var fileName = uploads_path + req.user._email + "/" + obj_name;
	var newDestination = uploads_path + req.user._email + "/decimar/";
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
	porcentaje = req.body.porcentaje;

	const spawn = require('child_process').spawn;
	const comando = spawn(exe, [origen, destino, porcentaje]);

	comando.stdout.setEncoding('utf8');
	comando.stderr.setEncoding('utf8');

	comando.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	comando.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
	});

	// TODO - Se debería guardar en la Base de Datos, si sí, entonces ¿cómo?
	comando.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		if (code === 0) {
			//resultado.destino = destino;
			resultado.codigo = 0;
		} 
		else {
			resultado.codigo = 1;
		}
		// TODO - Notificar al cliente
		console.log( JSON.stringify(resultado) );
		res.json(resultado);
	});
});



// TODO - Devolver el archivo dinámicamente
router.get('/fileobj/:obj', authEndPoint, function (req, res) {
	var uploads = "/home/jordy/node_projects/myapp/uploads/";
	//var _email  = "jordy@hotmail.com";//req.user._email;
	//var _obj    = "dd223c036a372347dfff98b4d8221bed"

  	//var fileName = "/home/jordy/node_projects/myapp/uploads/jordy@hotmail.com/city.obj";
	var fileName = uploads + req.user._email + "/decimar/" + req.params.obj;;

	// TODO - Corregir
	console.log(fileName);

	if (!fileName) {
		console.log("***GET /fileobj - No se proporcionó un fileName Válido");
		res.end();
		return;
	}

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


router.get('/principal', isAuthenticated, function (req, res) {
	fs.readFile('./public/pages/principal.html',function (err, data) {
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
	res.render('login');
});

/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
	successRedirect: '/principal'  // TODO - A donde redireccionar?
}));



/* GET Registration Page */
router.get('/signup', function(req, res){
	res.render('signup');
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
	successRedirect: '/principal',  // TODO - A donde redireccionar?
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
