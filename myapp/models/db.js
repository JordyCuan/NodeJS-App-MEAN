var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var mURL = "mongodb://localhost:27017/prefixa_db"


MongoClient.connect(
	mURL, 
	function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log('Connection established to', mURL);

			var collection = db.collection('prefixa_users');
			collection.createIndex( { _email : 1}, { unique: true } );
		}
	}
);

module.exports = {
  'url' : mURL
}
