var User = require('../models/user');
var Obj  = require('../models/archivos_obj');



// POST - /user/add
exports.add = function (req, res) {

	name = req.body.name;
	email = req.body.email;
	password = req.body.password;


	no_params = name && email && password;
	empty_param = name.replace(/\s/g, "") && email.replace(/\s/g, "") && password.replace(/\s/g, "");
	console.log("---------------------------------------");
	console.log(no_params);

	function validEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}


	console.log(req.body);

	if ( typeof no_params === 'undefined' || ! empty_param ) {
		console.log("No hay parametros");
		res.write("Falta uno o más parametros");
		res.end();  // TODO - ¿Que deberíamos responder cuando un parametro no está setteado?
		return;
	}
	if ( ! validEmail(email) ) {
		console.log("Email no valido");
		res.write("Email no valido");
		res.end();  // TODO - ¿Que deberíamos responder cuando un parametro no está setteado?
		return;
	}


	// Mongoose
	var user1 = new User({_name: name, _email: email, _password: password});
	user1.save(function (err, userObj) {
	    if (err) {
	        console.log(err);
	        res.write(err.errmsg);
	    } else {
	        console.log('saved successfully:', userObj);
	        res.write("Added");
	    }
	    res.end(); // TODO - ¿DEBEMOS ENVIAR ALGO?
	});
}




// GET - /user/list
exports.user_list = function (req, res) {

	User.find( {} , function (err, userObj) {
	    if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			res.write('Unable to connect to the mongoDB server. Error: ' + err + "\n");
		} else {
			// All Elements
			User.find({}, function(err, result) {
				if (err) {
					console.log(err);
					res.write(JSON.stringify(err));
				} else if (result.length) {
					console.log('Found:', result);
					res.write("\nElements:\n\n");

					// TODO - Aquí debería de devolverse un JSON no el JSON traducido. Además, no veo sentido de exponer esta ruta
					for(pos in result) {
						for (el in pos) {
							res.write("\t" + JSON.stringify(pos) + " : " + JSON.stringify(result[pos]) + "\n");
						}
						res.write("\n");
					}
				} else {
					console.log('No document(s) found with defined "find" criteria!');
					res.write('No document(s) found with defined "find" criteria!');
				}
				res.end();
			});
		}
	});
}




// POST - /upload
exports.upload_file = function function_name(req, res) {
	console.log(req.file);

	// El archivo ya ha sido guardado por Multer
	// ahora lo metemos a la DB
	var obj1 = new Obj({
						_originalname: req.file.originalname, 
						_localname: req.file.filename, 
						_path_and_name: req.file.path,
						_path: req.file.destination,
						_encoding: req.file.encoding,
    					_mimetype: req.file.mimetype,
    					_size: req.file.size
					}
	);
	

	// Guardamos el OBJ dentro de la base de datos
	obj1.save(function (err, obj) {
	    if (err) {
	        console.log(err);
	        res.write(err.errmsg);
	    } else {
	        console.log('saved successfully:', obj);
	        res.write("Added OBJ***");

	        // Se asocia el OBJ con el usuario que lo subio
	        User.findOne( { _id : req.user._id } , function(err, result) {
	        	if (err) {
					console.log(err);
					res.write(JSON.stringify(err));
				}
				else {
					result._objs.push( obj1._id );
					result.markModified('_objs');
    				result.save(); 
    				
					//res.redirect("back");
					res.write(JSON.stringify(obj1));
					res.end();
				}
	        });
	    }
	});	
}