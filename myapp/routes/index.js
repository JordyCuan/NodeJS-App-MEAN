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
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
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
	//res.status(304)        // HTTP status 304: NotLogged
	//	.send('Not found');
}


var authEndPoint = function (req, res, next) {
	if (req.isAuthenticated()) return next();

	res.status(304).send('Not Authenticated. Log in first');
}


/* GET home page. */
router.get('/', function(req, res, next) { res.render('index'); });


var controladores = require('../controllers/controladores');
var control_descargas = require('../controllers/controlador_descargas');


router.post('/user/add', controladores.add);
router.get('/user/list', controladores.user_list);


// Archivos por usuario
router.use('/user/files', authEndPoint);
router.get('/user/files', controladores.user_files);


// POST Subir archivo
router.use("/upload", authEndPoint);
router.use("/upload", upload.single("obj"));
router.post('/upload', controladores.upload_file);
// https://github.com/expressjs/multer/issues/58#issuecomment-75315556
// http://stackoverflow.com/questions/25698176/how-to-set-different-destinations-in-nodejs-using-multer


// Descargas de archivos objs: 
// Originales 
router.use("/file/original/:obj", authEndPoint);
router.get('/file/original/:obj', control_descargas.desc_original);
// y decimados
router.use("/file/decimado/:obj", authEndPoint);
router.get('/file/decimado/:obj', control_descargas.desc_decimado);




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

	var flag = 0;

	comando.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
		if (JSON.stringify(data).indexOf("entrada no valida.") >= 0 ) {
			flag = 1;
		}
	});

	comando.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
	});

	// TODO - Se debería guardar en la Base de Datos, si sí, entonces ¿cómo?
	comando.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		if (code === 0 && flag === 0) {
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






//req.params	- /element/:id/
//req.body		- /element/
//req.query		- /element?id=valor



/************************************************************************************************/
/************************************************************************************************/
//     PAGINAS ESTÁTICAS
/************************************************************************************************/
/************************************************************************************************/
router.get("/uploadfile", function(req, res) {
	res.render('UploadFile');
});


router.get("/uploadfile-js", function(req, res) {
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
//router.get('/home', isAuthenticated, function(req, res){
//	res.render('home', { user: req.user });
//});





module.exports = router;
