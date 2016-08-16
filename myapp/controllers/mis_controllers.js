

// GET - /users/bulk_add
exports.bulk_add = function (req, res) {
	var mongodb = require('mongodb');
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/my_database_name';

	MongoClient.connect(url, function (err, db) {
		if (err) {
			res.write('Unable to connect to the mongoDB server. Error: ' + err + "\n");
			// console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			res.write('Connection established to ' + url + "\n");
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
					var cad = 'Inserted ' + result.length +
						' documents into the "users" collection. The documents inserted with "_id" are: ' + 
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
	var mongodb = require('mongodb');
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/my_database_name';

	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			res.write('Unable to connect to the mongoDB server. Error: ' + err + "\n");
		} else {
			console.log('Connection established to', url);
			res.write('Connection established to' + url + "\n");

			var collection = db.collection('users');

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




// GET - /users/show_with_ejs
/*exports.users_list = function (req, res) {
	

	usersObj = // Get obj from db

	res.render('users_view', usersObj)
}
*/