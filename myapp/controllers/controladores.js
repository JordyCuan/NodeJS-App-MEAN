// POST - /user/add
exports.add = function (req, res) {
	var mongodb = require('mongodb');
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/prefixa_db';  // TODO - Cambiar por algo mas apropiado


	name = req.body.name;
	email = req.body.email;
	username = "asd";  // TODO - ¿Y qué cuando se repita el user name?
	password = req.body.password;


	no_params = name && email && username && password;
	console.log("---------------------------------------");
	console.log(no_params);


	console.log(req.body);

	if ( typeof no_params === 'undefined' ) {
		console.log("No hay parametros");
		res.write("Falta uno o más parametros");
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
				_username: username,
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