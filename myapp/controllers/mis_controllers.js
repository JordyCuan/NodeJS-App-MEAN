

// GET - /users/bulk_add
exports.bulk_add = function (req, res) {
	var mongodb = require('mongodb');
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/my_database_name';

	var which = "";

	MongoClient.connect(url, function (err, db) {
		if (err) {
			res.write('Unable to connect to the mongoDB server. Error: ' + err + "\n");
			// console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			res.write('Connection established to' + url + "\n");
			// console.log('Connection established to', url);

			// Get the documents collection
			var collection = db.collection('users');

			//Create some users
			var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
			var user2 = {name: 'modulus user', age: 22, roles: ['user']};
			var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

			// Insert some users
			collection.insert([user1, user2, user3], function (err, result) {
				if (err) {
					res.write(str(err));
					// console.log(err);
				} else {
					// obj_str = JSON.stringify(obj);
					var cad = 'Inserted' + result.length +
						'documents into the "users" collection. The documents inserted with "_id" are: ' + 
						JSON.stringify(result);

					res.write(cad + "\n");
					// console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
				}
				db.close();

				res.end();
			});
		}
	});


//	res.write(which);
//	console.log("********************" + which);
//	res.end();
}




// GET - /mis_paginas_estaticas/hello_estatico.html





// GET - /users/raw_list
exports.raw_users_list = function (req, res) {
	



	res.write("Hola\nMundo");
	res.end();
}




// GET - /users/show_with_ejs
/*exports.users_list = function (req, res) {
	

	usersObj = // Get obj from db

	res.render('users_view', usersObj)
}
*/