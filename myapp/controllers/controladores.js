// POST - /user/add
exports.add = function (req, res) {
	var mongodb = require('mongodb');
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/prefixa_db';  // TODO - Cambiar por algo mas apropiado



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





	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log('Connection established to', url);

			// Get the documents collection
			var collection = db.collection('prefixa_users');

			// Set the email as our id
			collection.createIndex( { _email : 1}, { unique: true } );

			//Create the object
			var user = {
				_name: name, 
				_email: email, 
				_password: password
			};

			// Insert
			collection.insert(user, function (err, result) {
				if (err) {
					console.log(err);
					//res.write(err.errmsg);
					res.write("El correo ya está en uso");
				} else {
					console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
					console.log("*** Inserted! ***");
					res.write("Added");
				}
				db.close();
				res.end();  // TODO - ¿DEBEMOS ENVIAR ALGO?
			});
		}
	});
}





// GET - /user/list
exports.user_list = function (req, res) {
	var mongodb = require('mongodb');
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/prefixa_db'; 

	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			res.write('Unable to connect to the mongoDB server. Error: ' + err + "\n");
		} else {
			console.log('Connection established to', url);
			res.write('Connection established to' + url + "\n");

			var collection = db.collection('prefixa_users');

			// All Elements
			collection.find({}).toArray(function (err, result) {
				if (err) {
					console.log(err);
					res.write(JSON.stringify(err));
				} else if (result.length) {
					console.log('Found:', result);
					res.write("\nElements:\n\n");

					for(pos in result) {
						for (el in result[pos]) {
							res.write("\t" + JSON.stringify(el) + " : " + JSON.stringify(result[pos][el]) + "\n");
						}
						res.write("\n");
					}
				} else {
					console.log('No document(s) found with defined "find" criteria!');
					res.write('No document(s) found with defined "find" criteria!');
				}
				db.close();
				res.end();
			});
		}
	});
}